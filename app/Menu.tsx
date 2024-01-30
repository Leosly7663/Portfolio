import React from 'react';

const NavBar: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white flex justify-between items-center">
      <h1 className="font-semibold text-3xl px-6">Leo</h1>
      <div className="flex space-x-4">
        <button className="hover:text-gray-400 py-4 px-6" onClick={() => scrollToSection('section1')}>
          About Me
        </button>
        <button className="hover:text-gray-500 py-4 px-6" onClick={() => scrollToSection('section2')}>
          Portfolio
        </button>
        <button className="hover:text-gray-600 py-4 px-6" onClick={() => scrollToSection('section3')}>
          Contact
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
