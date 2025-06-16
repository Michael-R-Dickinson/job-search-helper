import { frameId } from '../../content'
import { eventTypes } from '../../events'

/**
 * Iframe Message Handler
 *
 * Handles automatic detection and injection of message listeners into nested iframes,
 * including CSP-compliant solutions for srcdoc and about:blank iframes.
 */

type IframeInfo = {
  src: string
  id: string
  name: string
  contentWindow: boolean
  sandbox: string
  srcdoc: string
  documentURL: string
  contentScriptPresent: 'yes' | 'no' | 'injected' | 'injection-failed' | 'cross-origin-blocked'
}

// Scan for iframes with retry logic
const scanForIframes = (retryCount = 3, delay = 200): Promise<HTMLIFrameElement[]> => {
  return new Promise((resolve) => {
    const attemptScan = (attemptsLeft: number) => {
      // console.log(`[Frame ${frameId}] Document ready state: ${document.readyState}`)

      const iframes = Array.from(document.querySelectorAll('iframe'))

      // console.log(
      //   `[Frame ${frameId}] Scan attempt ${4 - attemptsLeft}, found ${iframes.length} iframes`,
      // )
      if (iframes.length > 0) {
        console.log(
          `[Frame ${frameId}] Found iframes:`,
          iframes.map((iframe) => ({
            src: iframe.src || 'no-src',
            id: iframe.id || 'no-id',
            srcdoc: iframe.srcdoc ? 'has-srcdoc' : 'no-srcdoc',
            documentURL: iframe.contentDocument?.URL || 'inaccessible',
            loaded: iframe.contentDocument?.readyState || 'unknown',
          })),
        )
      }

      if (iframes.length > 0 || attemptsLeft <= 1) {
        resolve(iframes)
      } else {
        // console.log(
        //   `[Frame ${frameId}] No iframes found, retrying in ${delay}ms (${attemptsLeft - 1} attempts left)`,
        // )
        setTimeout(() => attemptScan(attemptsLeft - 1), delay)
      }
    }

    attemptScan(retryCount)
  })
}

// CSP-compliant injection for srcdoc iframes
const injectIntoSrcdocIframe = async (frameEl: HTMLIFrameElement): Promise<boolean> => {
  try {
    const frameDoc = frameEl.contentDocument
    const win = frameEl.contentWindow as any

    if (!frameDoc || !win) return false

    // Check if already injected
    if (frameDoc.querySelector('#iframe-wrapper')) {
      return true
    }

    // console.log(`[Frame ${frameId}] → Injecting into srcdoc iframe`)

    // Set up frame identification
    win.frameId = 'srcdoc-' + Math.random().toString(36).substr(2, 8)

    // Set up message listener directly on window object
    win.addEventListener('message', (event: MessageEvent) => {
      if (event.data?.type === eventTypes.BEGIN_AUTOFILL_WITH_IFRAMES) {
        // console.log(
        //   `[Frame ${win.frameId}] ✅ Received BEGIN_AUTOFILL from frame ${event.data?.fromFrame}`,
        // )
        // Note: Cascading is handled by IframeAutofillWrapper, not here
      }
    })

    // Create minimal indicator
    const container = frameDoc.createElement('div')
    container.id = 'iframe-wrapper'
    container.style.cssText = 'display: none;' // Hidden indicator, just for detection

    if (frameDoc.body) {
      frameDoc.body.appendChild(container)
    } else {
      // Wait for body to exist
      const observer = new MutationObserver(() => {
        if (frameDoc.body) {
          frameDoc.body.appendChild(container)
          observer.disconnect()
        }
      })
      observer.observe(frameDoc.documentElement, { childList: true, subtree: true })
    }

    return true
  } catch (e) {
    console.error(`[Frame ${frameId}] ❌ Failed to inject into srcdoc iframe:`, e)
    return false
  }
}

// CSP-compliant injection for about:blank iframes
const injectIntoAboutBlankIframe = (frameEl: HTMLIFrameElement): boolean => {
  try {
    const win = frameEl.contentWindow as any
    const doc = frameEl.contentDocument

    if (!win || !doc) return false

    // Set up frame identification
    win.frameId = 'blank-' + Math.random().toString(36).substr(2, 8)

    // Set up message listener directly
    win.addEventListener('message', (event: MessageEvent) => {
      if (event.data?.type === eventTypes.BEGIN_AUTOFILL_WITH_IFRAMES) {
        // console.log(
        //   `[Frame ${win.frameId}] ✅ Received BEGIN_AUTOFILL from frame ${event.data?.fromFrame}`,
        // )
        // Note: Cascading is handled by IframeAutofillWrapper, not here
      }
    })

    // Create minimal indicator
    const container = doc.createElement('div')
    container.id = 'iframe-wrapper'
    container.style.cssText = 'display: none;' // Hidden indicator, just for detection

    if (doc.body) {
      doc.body.appendChild(container)
    } else {
      // Create body if it doesn't exist
      const body = doc.createElement('body')
      doc.documentElement.appendChild(body)
      body.appendChild(container)
    }

    return true
  } catch (e) {
    console.log(`[Frame ${frameId}] ❌ Failed injection into about:blank iframe:`, e)
    return false
  }
}

// Check and inject into iframe if needed
const processIframe = async (frameEl: HTMLIFrameElement): Promise<IframeInfo> => {
  const frameInfo: IframeInfo = {
    src: frameEl.src,
    id: frameEl.id,
    name: frameEl.name,
    contentWindow: !!frameEl.contentWindow,
    sandbox: frameEl.sandbox.toString(),
    srcdoc: frameEl.srcdoc ? 'has srcdoc content' : 'none',
    documentURL: frameEl.contentDocument?.URL || 'inaccessible',
    contentScriptPresent: 'cross-origin-blocked',
  }

  try {
    const hasOurWrapper = frameEl.contentDocument?.querySelector('#iframe-wrapper')
    frameInfo.contentScriptPresent = hasOurWrapper ? 'yes' : 'no'

    // If no content script, try injection based on iframe type
    if (!hasOurWrapper && frameEl.contentDocument) {
      if (frameEl.srcdoc) {
        // Srcdoc iframe - use direct property injection
        const injected = await injectIntoSrcdocIframe(frameEl)
        frameInfo.contentScriptPresent = injected ? 'injected' : 'injection-failed'
      } else if (
        frameEl.contentDocument.URL === 'about:blank' ||
        frameEl.contentDocument.URL === ''
      ) {
        // About:blank iframe - use direct property injection
        const injected = injectIntoAboutBlankIframe(frameEl)
        frameInfo.contentScriptPresent = injected ? 'injected' : 'injection-failed'
      }
    }
  } catch (e) {
    // Cross-origin or other access issues
    frameInfo.contentScriptPresent = 'cross-origin-blocked'
  }

  return frameInfo
}

/**
 * Main function: Set up message passing to all nested iframes
 * Handles detection, injection, and message sending automatically
 */
export const setupIframeMessagePassing = async () => {
  const iframes = await scanForIframes()

  if (iframes.length === 0) {
    // console.log(`[Frame ${frameId}] No nested iframes found`)

    // Set up mutation observer to catch dynamically created iframes
    const observer = new MutationObserver((mutations) => {
      let foundNewIframe = false

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element

            // Check if it's an iframe
            if (element.tagName === 'IFRAME') {
              // console.log(`[Frame ${frameId}] 🔍 New iframe detected via mutation observer`)
              foundNewIframe = true
            }

            // Check for nested iframes
            const nestedIframes = element.querySelectorAll('iframe')
            if (nestedIframes.length > 0) {
              // console.log(
              //   `[Frame ${frameId}] 🔍 Found ${nestedIframes.length} nested iframes via mutation observer`,
              // )
              foundNewIframe = true
            }
          }
        })
      })

      // If we found new iframes, rescan and send messages
      if (foundNewIframe) {
        // console.log(`[Frame ${frameId}] → Rescanning due to new iframes detected`)
        setTimeout(async () => {
          await setupIframeMessagePassing()
        }, 300) // Give the iframe time to fully load
      }
    })

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
    })

    // console.log(`[Frame ${frameId}] Set up mutation observer for dynamic iframes`)
    return
  }

  // console.log(`[Frame ${frameId}] → Sending messages to ${iframes.length} nested iframes`)

  // Process each iframe and send messages
  for (let i = 0; i < iframes.length; i++) {
    const frameEl = iframes[i]
    // console.log(`[Frame ${frameId}] Processing iframe ${i + 1}/${iframes.length}:`, {
    //   src: frameEl.src || 'no-src',
    //   id: frameEl.id || 'no-id',
    //   srcdoc: frameEl.srcdoc ? 'has-srcdoc' : 'no-srcdoc',
    //   documentURL: frameEl.contentDocument?.URL || 'inaccessible',
    // })

    await processIframe(frameEl)

    // Send BEGIN_AUTOFILL message to the iframe
    try {
      frameEl.contentWindow?.postMessage(
        {
          type: eventTypes.BEGIN_AUTOFILL_WITH_IFRAMES,
          fromFrame: frameId,
          timestamp: Date.now(),
        },
        '*',
      )
      // console.log(`[Frame ${frameId}] ✅ Sent message to iframe ${i + 1}`)
    } catch (e) {
      console.warn(`[Frame ${frameId}] ❌ Failed to send message to iframe ${i + 1}:`, e)
    }
  }
}

/**
 * Simple interface: Send autofill message to all nested iframes
 * This is the main function that should be called from the frontend
 */
export const sendAutofillMessageToIframes = async () => {
  await setupIframeMessagePassing()
}
