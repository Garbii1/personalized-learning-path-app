import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p>© {currentYear} LearnPath. All rights reserved.</p>
        <p className="text-sm mt-1">Created as a Full-Stack Developer Portfolio Project.</p>
        {/* Add links to GitHub, portfolio, etc. if desired */}
      </div>
    </footer>
  );
}

export default Footer;