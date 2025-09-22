// Environment variable validation
function validateEnvVars() {
  // Essential environment variables - app will not work without these
  const essentialVars = {
    VITE_FIREBASE_API_KEY: 'Required for Firebase authentication',
    VITE_FIREBASE_AUTH_DOMAIN: 'Required for Firebase authentication',
    VITE_FIREBASE_PROJECT_ID: 'Required for Firebase project identification',
    VITE_FIREBASE_STORAGE_BUCKET: 'Required for Firebase storage',
    VITE_FIREBASE_MESSAGING_SENDER_ID: 'Required for Firebase messaging',
    VITE_FIREBASE_APP_ID: 'Required for Firebase app identification',
    VITE_BACKEND_API_URL: 'Required for backend API communication'
  }

  // Non-essential environment variables
  const optionalVars = {
    VITE_FIREBASE_MEASUREMENT_ID: 'Optional for Firebase Analytics'
  }

  const missingEssential: string[] = []
  const missingOptional: string[] = []

  // Check essential variables
  for (const [varName, description] of Object.entries(essentialVars)) {
    const value = import.meta.env[varName]
    if (!value || value.trim() === '') {
      missingEssential.push(`  - ${varName}: ${description}`)
    }
  }

  // Check optional variables
  for (const [varName, description] of Object.entries(optionalVars)) {
    const value = import.meta.env[varName]
    if (!value || value.trim() === '') {
      missingOptional.push(`  - ${varName}: ${description}`)
    }
  }

  // Handle missing essential variables
  if (missingEssential.length > 0) {
    const errorMsg = '❌ CRITICAL: Missing required environment variables:\n' +
      missingEssential.join('\n') +
      '\n\nPlease set these variables in your .env.local file.'
    console.error(errorMsg)
    throw new Error('Missing required environment variables')
  }

  // Warn about missing optional variables
  if (missingOptional.length > 0) {
    const warningMsg = '⚠️  WARNING: Missing optional environment variables:\n' +
      missingOptional.join('\n') +
      '\n\nSome functionality may be limited.'
    console.warn(warningMsg)
  }
}

// Validate environment variables on import
validateEnvVars()

export const FIREBASE_API_KEY = import.meta.env.VITE_FIREBASE_API_KEY!
export const FIREBASE_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN!
export const FIREBASE_PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID!
export const FIREBASE_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET!
export const FIREBASE_MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID!
export const FIREBASE_APP_ID = import.meta.env.VITE_FIREBASE_APP_ID!
export const FIREBASE_MEASUREMENT_ID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID!

export const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL!

// Debug logs
// console.log({
//   FIREBASE_API_KEY,
//   FIREBASE_AUTH_DOMAIN,
//   FIREBASE_PROJECT_ID,
//   FIREBASE_STORAGE_BUCKET,
//   FIREBASE_MESSAGING_SENDER_ID,
//   FIREBASE_APP_ID,
//   FIREBASE_MEASUREMENT_ID,
//   BACKEND_API_URL,
// })
