import { GoogleAuthProvider } from "firebase/auth";

console.log('Background script loaded')

// chrome.identity.getAuthToken({ interactive: true }, (accessToken) => {
//   if (chrome.runtime.lastError || !accessToken) {
//     console.error("Auth failed", chrome.runtime.lastError);
//     return;
//   }

//   // Build a Firebase credential with the Google access token
//   const cred = GoogleAuthProvider.credential(null, accessToken.token);
//   console.log("Got access token:", accessToken);
//   // signInWithCredential(auth, cred)
//   //   .then(userCred => {
//   //     console.log("✅ Signed into Firebase:", userCred.user.uid);
//   //   })
//   //   .catch(console.error);
// });
