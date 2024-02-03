import React from 'react';
import OpacityToggle from './Opacity';

const NavBar: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: "nearest"});
    }
  };

  return (
    <nav className="fixed z-10 top-0 left-0 w-full bg-gray-800 text-white flex justify-between items-center">
      <div className="font-semibold text-2xl px-6">
          <div className="text text-[#2bff00]">
              root@Leo: 
              <div className="text text-[#00a2ff]">
                  ~ 
              </div>
              <div className="text text-[#e6e6e6]">
                $ cd
                <OpacityToggle text="_"/>   
              </div>
            </div>
        </div>
      <div className="flex space-x-4">
        <button className="hover:text-gray-400 py-4 px-6" onClick={() => scrollToSection('about')}>
          ~/About Me
        </button>
        <button className="hover:text-gray-500 py-4 px-6" onClick={() => scrollToSection('portfolio')}>
          ~/Portfolio
        </button>
        <button className="hover:text-gray-600 py-4 px-6" onClick={() => scrollToSection('contact')}>
          ~/Contact
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
