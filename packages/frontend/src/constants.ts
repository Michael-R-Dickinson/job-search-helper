// Environment variable validation
function validateEnvVars() {
  // Essential environment variables - app will not work without these
  const essentialVars = {
    NEXT_PUBLIC_FIREBASE_API_KEY: 'Required for Firebase authentication',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'Required for Firebase authentication',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'Required for Firebase project identification',
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'Required for Firebase storage',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: 'Required for Firebase messaging',
    NEXT_PUBLIC_FIREBASE_APP_ID: 'Required for Firebase app identification',
    NEXT_PUBLIC_BACKEND_API_URL: 'Required for backend API communication'
  }

  // Non-essential environment variables
  const optionalVars = {
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: 'Optional for Firebase Analytics'
  }

  const missingEssential: string[] = []
  const missingOptional: string[] = []

  // Check essential variables
  for (const [varName, description] of Object.entries(essentialVars)) {
    const value = process.env[varName]
    if (!value || value.trim() === '') {
      missingEssential.push(`  - ${varName}: ${description}`)
    }
  }

  // Check optional variables
  for (const [varName, description] of Object.entries(optionalVars)) {
    const value = process.env[varName]
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

export const PUBLIC_FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY!
export const PUBLIC_FIREBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!
export const PUBLIC_FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!
export const PUBLIC_FIREBASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!
export const PUBLIC_FIREBASE_MESSAGING_SENDER_ID =
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!
export const PUBLIC_FIREBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
export const PUBLIC_FIREBASE_MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!

export const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL!

export const ENVIRONMENT_NAME = process.env.NODE_ENV || 'development'
