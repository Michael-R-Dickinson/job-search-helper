import { useState, useEffect } from 'react'

export type ElementInfo = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
export interface InputInfo {
  element: ElementInfo
  label: string | null
  elementReferenceId: string
}

function generateUniqueId() {
  // e.g. "af-3f2504e0-4f89-11d3-9a0c-0305e82c3301"
  return `af-${crypto.randomUUID()}`
}

/**
 * Custom React hook to find all user-fillable inputs, textareas, and selects on the page,
 * plus their labels, excluding:
 * - aria-hidden or opacity:0
 * - disabled or readOnly
 * - input types that aren’t text-entry (button, hidden, submit, etc.)
 * - elements whose id/name/class contains "captcha"
 */
export function useInputElements(): InputInfo[] {
  const [inputs, setInputs] = useState<InputInfo[]>([])

  useEffect(() => {
    const getLabelText = (el: HTMLElement): string | null => {
      if (el.id) {
        const explicit = document.querySelector<HTMLLabelElement>(`label[for="${el.id}"]`)
        if (explicit) return explicit.textContent?.trim() ?? null
      }
      let parent: HTMLElement | null = el.parentElement
      while (parent) {
        if (parent.tagName.toLowerCase() === 'label') {
          return parent.textContent?.trim() ?? null
        }
        parent = parent.parentElement
      }
      return null
    }

    const scan = () => {
      const nodeList = document.querySelectorAll<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >('input, textarea, select')

      const filtered: InputInfo[] = Array.from(nodeList)
        .filter((el) => {
          const tag = el.tagName.toLowerCase()

          // 1) Exclude aria-hidden or invisible styles
          if (el.getAttribute('aria-hidden') === 'true') return false
          const style = window.getComputedStyle(el)
          if (style.opacity === '0' || style.visibility === 'hidden' || style.display === 'none')
            return false

          // 2) Exclude captchas by id/name/class
          const id = el.id?.toLowerCase() ?? ''
          const name = el.getAttribute('name')?.toLowerCase() ?? ''
          const cls = el.className?.toString().toLowerCase() ?? ''
          if (id.includes('captcha') || name.includes('captcha') || cls.includes('captcha'))
            return false

          // 3) Exclude controls that aren’t meant for text entry
          if (tag === 'input') {
            const inp = el as HTMLInputElement
            // no hidden/buttons/etc.
            const allowed = ['text', 'email', 'password', 'search', 'tel', 'url', 'number']
            if (!allowed.includes(inp.type)) return false
            if (inp.disabled || inp.readOnly) return false
          } else if (tag === 'textarea') {
            const ta = el as HTMLTextAreaElement
            if (ta.disabled || ta.readOnly) return false
          } else if (tag === 'select') {
            const sel = el as HTMLSelectElement
            if (sel.disabled) return false
          }

          return true
        })
        .map((el) => {
          const elementReferenceId = generateUniqueId()
          el.setAttribute('data-autofill-id', elementReferenceId)
          return {
            element: el,
            elementReferenceId,
            label: getLabelText(el as HTMLElement),
          }
        })

      setInputs(filtered)
    }

    scan()
    const observer = new MutationObserver(scan)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return inputs
}
