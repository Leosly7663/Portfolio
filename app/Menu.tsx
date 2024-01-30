import React from 'react';

const NavBar: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">Leo</h1>
      <div className="flex space-x-4">
        <button className="hover:text-gray-300" onClick={() => scrollToSection('section1')}>
          Section 1
        </button>
        <button className="hover:text-gray-300" onClick={() => scrollToSection('section2')}>
          Section 2
        </button>
        <button className="hover:text-gray-300" onClick={() => scrollToSection('section3')}>
          Section 3
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
