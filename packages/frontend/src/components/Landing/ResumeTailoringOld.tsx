// import React from 'react'
// import { FileText, ArrowRight, Linkedin, Upload, CheckCircle } from 'lucide-react'

// const ResumeTailoring = () => (
//   <div className="animate-fade-in">
//     <h2 className="mb-6 text-center">
//       Step 1: <span className="gradient-text">Craft a Winning Resume</span> for Every Role.
//       Instantly.
//     </h2>
//     {/* Visual Process Flow for Resume Tailoring - Now in its own section */}
//     <div className="relative bg-white rounded-xl p-8 shadow-lg mb-10 overflow-hidden">
//       <div className="absolute top-0 right-0 w-24 h-24 bg-perfectify-light/30 rounded-bl-3xl"></div>
//       <div className="absolute bottom-0 left-0 w-24 h-24 bg-perfectify-light/20 rounded-tr-3xl"></div>
//       <h3 className="text-xl font-bold mb-8 text-center relative z-10">
//         How Resume Tailoring Works
//       </h3>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
//         {/* Step 1: Upload Your Resume */}
//         <div className="bg-linear-to-b from-white to-perfectify-light/20 rounded-xl p-6 shadow-md text-center relative transition-all hover:shadow-lg transform hover:scale-105 border border-perfectify-light/30">
//           <div className="absolute -top-4 -left-4 w-10 h-10 bg-perfectify-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
//             1
//           </div>
//           <div className="flex justify-center">
//             <div className="bg-perfectify-light/40 w-20 h-20 rounded-full flex items-center justify-center mb-4">
//               <Upload className="w-10 h-10 text-perfectify-primary" />
//             </div>
//           </div>
//           <h4 className="font-bold text-lg mb-3">Upload Your Resume</h4>
//           <p className="text-sm text-muted-foreground mb-4">Drag & drop your existing resume</p>
//           <div className="flex justify-center gap-3">
//             <div className="bg-white rounded-lg p-2 shadow-xs border border-gray-100">
//               <FileText className="w-6 h-6 text-perfectify-primary" />
//               <p className="text-xs mt-1">Word</p>
//             </div>
//             <div className="bg-white rounded-lg p-2 shadow-xs border border-gray-100">
//               <FileText className="w-6 h-6 text-blue-500" />
//               <p className="text-xs mt-1">Google Docs</p>
//             </div>
//             <div className="bg-white rounded-lg p-2 shadow-xs border border-gray-100">
//               <FileText className="w-6 h-6 text-red-500" />
//               <p className="text-xs mt-1">PDF</p>
//             </div>
//           </div>
//         </div>
//         {/* Step 2: Add Job URL */}
//         <div className="bg-linear-to-b from-white to-perfectify-light/20 rounded-xl p-6 shadow-md text-center relative transition-all hover:shadow-lg transform hover:scale-105 border border-perfectify-light/30">
//           <div className="absolute -top-4 -left-4 w-10 h-10 bg-perfectify-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
//             2
//           </div>
//           <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
//             <ArrowRight className="w-8 h-8 text-perfectify-primary" />
//           </div>
//           <div className="lg:hidden absolute -bottom-4 left-1/2 transform -translate-x-1/2 rotate-90 z-10">
//             <ArrowRight className="w-8 h-8 text-perfectify-primary" />
//           </div>
//           <div className="flex justify-center">
//             <div className="bg-perfectify-light/40 w-20 h-20 rounded-full flex items-center justify-center mb-4">
//               <Linkedin className="w-10 h-10 text-[#0A66C2]" />
//             </div>
//           </div>
//           <h4 className="font-bold text-lg mb-3">Add Job URL</h4>
//           <p className="text-sm text-muted-foreground mb-4">Paste the LinkedIn job listing URL</p>
//           <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-xs text-left">
//             <div className="flex items-center mb-2">
//               <Linkedin className="w-4 h-4 mr-1 text-[#0A66C2]" />
//               <p className="text-sm font-medium text-[#0A66C2]">LinkedIn Job</p>
//             </div>
//             <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-500 truncate">
//               linkedin.com/jobs/view/marketing-manager
//             </div>
//           </div>
//         </div>
//         {/* Step 3: Get Tailored Resume */}
//         <div className="bg-linear-to-b from-white to-perfectify-primary/20 rounded-xl p-6 shadow-md text-center relative transition-all hover:shadow-lg transform hover:scale-105 border border-perfectify-primary/30">
//           <div className="absolute -top-4 -left-4 w-10 h-10 bg-perfectify-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
//             3
//           </div>
//           <div className="flex justify-center">
//             <div className="bg-perfectify-primary/30 w-20 h-20 rounded-full flex items-center justify-center mb-4">
//               <CheckCircle className="w-10 h-10 text-perfectify-primary" />
//             </div>
//           </div>
//           <h4 className="font-bold text-lg text-perfectify-primary mb-3">Get Tailored Resume</h4>
//           <p className="text-sm text-muted-foreground mb-4">
//             Your optimized resume is ready to download
//           </p>
//           <button className="bg-perfectify-primary hover:bg-perfectify-secondary text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center mx-auto">
//             <FileText className="w-4 h-4 mr-2" />
//             Download Resume
//           </button>
//         </div>
//       </div>
//     </div>
//     {/* Before & After Resume Comparison - Now in a separate panel */}
//     <div className="relative bg-white rounded-xl p-8 shadow-lg mb-10 overflow-hidden">
//       <div className="absolute top-0 right-0 w-24 h-24 bg-perfectify-light/30 rounded-bl-3xl"></div>
//       <div className="absolute bottom-0 left-0 w-24 h-24 bg-perfectify-light/20 rounded-tr-3xl"></div>
//       <h3 className="text-xl font-bold mb-6 text-center">Before & After Comparison</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
//         {/* Original Resume */}
//         <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-md relative">
//           <div className="absolute -top-4 left-4 bg-gray-100 px-4 py-1 rounded-full font-medium text-gray-600 text-sm shadow-xs">
//             ORIGINAL RESUME
//           </div>
//           <div className="mb-4 pb-4 border-b border-gray-100">
//             <h3 className="font-bold text-lg">John Smith</h3>
//             <p className="text-sm text-gray-600">Digital Marketing Specialist</p>
//           </div>
//           <div className="mb-4">
//             <h4 className="font-medium text-sm mb-1">EXPERIENCE</h4>
//             <div className="mb-3">
//               <p className="font-medium">Marketing Specialist, TechCorp</p>
//               <p className="text-sm text-gray-600 mb-1">2020 - Present</p>
//               <ul className="text-sm list-disc pl-4 space-y-1">
//                 <li>Managed social media accounts and created content</li>
//                 <li>Worked on email marketing campaigns</li>
//                 <li>Analyzed performance metrics</li>
//                 <li>Coordinated with the marketing team</li>
//               </ul>
//             </div>
//           </div>
//           <div>
//             <h4 className="font-medium text-sm mb-1">SKILLS</h4>
//             <div className="flex flex-wrap gap-1">
//               <span className="bg-gray-100 px-2 py-1 rounded text-xs">Social Media</span>
//               <span className="bg-gray-100 px-2 py-1 rounded text-xs">Content Writing</span>
//               <span className="bg-gray-100 px-2 py-1 rounded text-xs">Analytics</span>
//               <span className="bg-gray-100 px-2 py-1 rounded text-xs">Email Marketing</span>
//             </div>
//           </div>
//         </div>
//         {/* Tailored Resume */}
//         <div className="bg-linear-to-b from-white to-perfectify-light/20 rounded-lg p-6 border border-perfectify-primary/30 shadow-md relative">
//           <div className="absolute -top-4 left-4 bg-perfectify-primary px-4 py-1 rounded-full font-medium text-white text-sm shadow-md">
//             TAILORED RESUME
//           </div>
//           <div className="mb-4 pb-4 border-b border-perfectify-light">
//             <h3 className="font-bold text-lg">John Smith</h3>
//             <p className="text-sm text-gray-600">
//               <span className="font-semibold text-perfectify-primary">
//                 Senior Digital Marketing Specialist
//               </span>
//             </p>
//           </div>
//           <div className="mb-4">
//             <h4 className="font-medium text-sm mb-1">EXPERIENCE</h4>
//             <div className="mb-3">
//               <p className="font-medium">Marketing Specialist, TechCorp</p>
//               <p className="text-sm text-gray-600 mb-1">2020 - Present</p>
//               <ul className="text-sm list-disc pl-4 space-y-1">
//                 <li>
//                   <span className="font-medium text-perfectify-primary">Strategically managed</span>{' '}
//                   social media accounts and{' '}
//                   <span className="font-medium text-perfectify-primary">
//                     created engaging content that increased user engagement by 34%
//                   </span>
//                 </li>
//                 <li>
//                   <span className="font-medium text-perfectify-primary">
//                     Developed and executed
//                   </span>{' '}
//                   email marketing campaigns{' '}
//                   <span className="font-medium text-perfectify-primary">
//                     resulting in a 25% increase in open rates
//                   </span>
//                 </li>
//                 <li>
//                   <span className="font-medium text-perfectify-primary">
//                     Conducted in-depth analysis
//                   </span>{' '}
//                   of performance metrics to{' '}
//                   <span className="font-medium text-perfectify-primary">
//                     optimize marketing strategies
//                   </span>
//                 </li>
//                 <li>
//                   <span className="font-medium text-perfectify-primary">
//                     Collaborated cross-functionally
//                   </span>{' '}
//                   with the marketing team to{' '}
//                   <span className="font-medium text-perfectify-primary">
//                     ensure brand consistency
//                   </span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div>
//             <h4 className="font-medium text-sm mb-1">SKILLS</h4>
//             <div className="flex flex-wrap gap-1">
//               <span className="bg-perfectify-primary/20 border border-perfectify-primary/30 px-2 py-1 rounded text-xs font-medium text-perfectify-primary">
//                 Social Media Strategy
//               </span>
//               <span className="bg-perfectify-primary/20 border border-perfectify-primary/30 px-2 py-1 rounded text-xs font-medium text-perfectify-primary">
//                 SEO Content Creation
//               </span>
//               <span className="bg-perfectify-primary/20 border border-perfectify-primary/30 px-2 py-1 rounded text-xs font-medium text-perfectify-primary">
//                 Google Analytics
//               </span>
//               <span className="bg-perfectify-primary/20 border border-perfectify-primary/30 px-2 py-1 rounded text-xs font-medium text-perfectify-primary">
//                 Marketing Automation
//               </span>
//             </div>
//           </div>
//         </div>
//         {/* Connecting Arrow */}
//         <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
//           <ArrowRight className="w-10 h-10 text-perfectify-primary" />
//         </div>
//         {/* Mobile Arrow */}
//         <div className="md:hidden flex justify-center absolute left-1/2 -bottom-6 -translate-x-1/2">
//           <ArrowRight className="w-6 h-6 text-perfectify-primary transform rotate-90" />
//         </div>
//       </div>
//     </div>
//     <ul className="space-y-4 mb-6">
//       <li className="flex gap-3">
//         <div className="mt-1 bg-perfectify-light rounded-full p-1">
//           <svg
//             width="16"
//             height="16"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M20 6L9 17L4 12"
//               stroke="#9b87f5"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </div>
//         <div>
//           <h3 className="font-medium text-lg">Maximized Match</h3>
//           <p className="text-muted-foreground">
//             Ensure your resume speaks directly to what recruiters and Applicant Tracking Systems
//             (ATS) are looking for.
//           </p>
//         </div>
//       </li>
//       <li className="flex gap-3">
//         <div className="mt-1 bg-perfectify-light rounded-full p-1">
//           <svg
//             width="16"
//             height="16"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M20 6L9 17L4 12"
//               stroke="#9b87f5"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </div>
//         <div>
//           <h3 className="font-medium text-lg">Effortless Customization</h3>
//           <p className="text-muted-foreground">
//             Transform your standard Google Doc or Word resume into a tailored masterpiece in
//             seconds.
//           </p>
//         </div>
//       </li>
//       <li className="flex gap-3">
//         <div className="mt-1 bg-perfectify-light rounded-full p-1">
//           <svg
//             width="16"
//             height="16"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M20 6L9 17L4 12"
//               stroke="#9b87f5"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </div>
//         <div>
//           <h3 className="font-medium text-lg">Increased Interview Calls</h3>
//           <p className="text-muted-foreground">
//             Make a powerful first impression with every application, significantly boosting your
//             chances of landing an interview.
//           </p>
//         </div>
//       </li>
//     </ul>
//   </div>
// )

// export default ResumeTailoring
