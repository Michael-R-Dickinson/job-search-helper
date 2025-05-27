'use client'

import { useState, useEffect } from 'react'
import UploadResumeInput from '../UploadResumeButton'
import PublishResumeProgressButton from './UploadProgressButton'

// Get the site key from environment variables
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

const ResumeUploadTile: React.FC<{ onUploadComplete: (fileName: string) => void }> = ({
  onUploadComplete,
}) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false)

  // Load the reCAPTCHA script when the component mounts (Keep this for reCAPTCHA)
  useEffect(() => {
    const scriptId = 'recaptcha-script';
    // Prevent loading the script multiple times if the component re-renders
    if (document.getElementById(scriptId)) {
        setIsRecaptchaReady(true); // Optimistically set ready if script tag exists
        return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    // Use the reCAPTCHA Enterprise script URL with your site key
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;

    // Define the onload callback and a dummy grecaptcha object
    // @ts-ignore // Ignore TypeScript error for grecaptcha
    window.grecaptcha = {
        enterprise: {
            ready: (callback: () => void) => {
                if (typeof callback === 'function') {
                    callback();
                }
                 setIsRecaptchaReady(true); // Confirm ready state
            },
             // Simplified dummy execute - won't try to queue or wait extensively
            execute: (siteKey: string, options: { action: string }) => {
                 console.warn('grecaptcha.enterprise.execute called before script loaded or ready. Returning dummy token.');
                 return Promise.resolve('dummy_token_before_load'); // Return a dummy token immediately
            }
        }
    };


    script.onload = () => {
        // @ts-ignore
        if(window.grecaptcha && window.grecaptcha.enterprise && typeof window.grecaptcha.enterprise.ready === 'function') {
             // @ts-ignore
             window.grecaptcha.enterprise.ready(() => {
                  setIsRecaptchaReady(true);
                  console.log("reCAPTCHA Enterprise script loaded and ready.");
             });
        } else {
             console.error("reCAPTCHA script loaded, but grecaptcha.enterprise.ready not found.");
             setIsRecaptchaReady(false); // Script loaded but API not ready
        }
    };

    script.onerror = (error) => {
      console.error("reCAPTCHA script loading error:", error);
      setIsRecaptchaReady(false); // Script failed to load
      // Handle error - maybe disable the button permanently or show a message
    };

    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      const scriptElement = document.getElementById(scriptId);
      if (scriptElement) {
        scriptElement.remove();
        // @ts-ignore
        delete window.grecaptcha;
      }
    };
  }, []);

  // Simplified function to handle the upload after reCAPTCHA execution (No backend call)
  const handleUploadAfterRecaptcha = async () => {
      if (!resumeFile || !isRecaptchaReady) {
          console.log("Cannot upload: No file selected or reCAPTCHA not ready.");
          // Optionally show a user-friendly message here
          return;
      }

      try {
          // 1. Execute reCAPTCHA in the browser to get a token (Keep this)
          // @ts-ignore // Ignore TypeScript error for grecaptcha
          const token = await grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, { action: 'upload' });
          console.log("reCAPTCHA token obtained:", token);

          // 2. *** REMOVED: Backend verification step ***

          // 3. Proceed directly with the original upload complete logic after getting the token
          setTimeout(() => {
            onUploadComplete(resumeFile?.name || 'no-name-provided')
          }, 400);

           // TODO: In a real application, you would send the token to your backend HERE
           // for verification before calling onUploadComplete.

      } catch (error) {
          console.error("Error during reCAPTCHA execution:", error);
          // Handle errors (e.g., show an error message to the user)
           alert("An error occurred. Please try again."); // Simple alert for now
      }
  };


  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Upload Your Resume</h1>
      <p className="text-gray-600">
        Drag &amp; drop your resume here, or click below to choose a file that is in a{' '}
        <strong className="text-perfectify-purple">word or doc file.</strong>
      </p>

      <UploadResumeInput resumeFile={resumeFile} setResumeFile={setResumeFile} />
      <PublishResumeProgressButton
        resumeFile={resumeFile}
        onUploadComplete={handleUploadAfterRecaptcha}
        disabled={!isRecaptchaReady || !resumeFile}
      />
    </div>
  )
}

export default ResumeUploadTile
