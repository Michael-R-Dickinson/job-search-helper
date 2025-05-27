const AUTH_PAGE_URL = 'http://localhost:8080/extensionAuth'
// const AUTH_PAGE_URL = 'http://localhost:8080/extensionAuth/signIn'
const SIGNIN_PAGE_URL = 'http://localhost:8080/extensionAuth/signIn'

export function injectAuthFrame() {
  if (document.getElementById('ext-auth')) return
  const iframe = document.createElement('iframe')
  iframe.id = 'ext-auth'
  console.log('Injecting auth iframe', AUTH_PAGE_URL)
  iframe.src = AUTH_PAGE_URL
  // iframe.style.display = 'none'
  document.body.appendChild(iframe)

  // Kick off auth as soon as the frame is ready
  // iframe.onload = () => {
  //   iframe.contentWindow!.postMessage({ initAuth: true }, '*')
  // }

  // Listen for the result
  window.addEventListener('message', (e) => {
    if (e.source !== iframe.contentWindow) return
    const { type, payload } = JSON.parse(e.data)
    if (type === 'AUTH_SUCCESS' || type === 'AUTH_ERROR') {
      // forward to background or your React UI
      chrome.runtime.sendMessage({ type, payload })
      // iframe.remove()
    }
    if (type === 'AUTH_ERROR') {
      console.log('Auth error:', payload)
      window.open(SIGNIN_PAGE_URL, '_blank')
    }
  })
}
