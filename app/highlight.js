"use client"
import React from 'react';
import { useState } from 'react';
import OpacityToggle from './Opacity.js'

const Highlight = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClick, setIsClick] = useState(false);
  return (
    <div className="w-full justify-center mt-5 pt-60 pb-60 flex">
      <div className='bg-[#66666647] w-11/12 flex flex-rw p-5 justify-evenly space-x-5 rounded-xl'>
        <div className="bg-black h-80 w-2/5 rounded-xl">
            <div className=''>
                <p className='text-white text-left border-b px-8 pt-4 pb-4 text-7xl font-oswald font-light'>
                    Python Webscrape HUD
                </p>
                <div className='flex justify-center'>
                    <p className='text-gray p-2 rounded-md bg-[#332457] mt-4 text-xl' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={() => setIsClick(!isClick)}>
                        View Project
                    </p>
                </div>
            </div>
        </div>
        <div className="bg-black h-80 w-2/5 rounded-xl">

        </div>
      </div>
    </div>
  );
};

export default Highlight;