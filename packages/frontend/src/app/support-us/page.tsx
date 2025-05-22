import React from 'react';

const SupportUsPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-perfectify-purple">Support Us</h1>
        <p className="text-gray-700 mb-6">
          If you find this project helpful, consider supporting us! Your donation helps us keep the service free and improve it for everyone.
        </p>
        <a
          href="https://www.buymeacoffee.com/yourusername" // Replace with your actual donation link
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-perfectify-purple text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-perfectify-secondary transition"
        >
          ☕ Donate / Buy us a coffee
        </a>
        <p className="my-2 text-gray-500 font-medium">or</p>
        <a
          className="inline-block bg-gradient-to-r from-pink-500 via-red-400 to-pink-400 text-white font-semibold px-6 py-3 rounded-lg shadow hover:from-pink-600 hover:to-red-500 transition flex items-center justify-center gap-2"
          href="https://www.instagram.com/michael.dknsn/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span role="img" aria-label="love">❤️</span>Find us the Huzz! Michael loves the huzz :)
        </a>
      </div>
    </div>
  );
};

export default SupportUsPage; 