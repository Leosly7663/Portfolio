"use client"
import React from 'react';
import NavBar from '../Menu';
import ImageCarousel from '../slider.js';


const pythonHUD = () => {
  return (
    <div className="w-full bg-black flex justify-center">
      <NavBar/>

      <div className=' w-11/12 mt-16 h-screen justify-start bg-red-200'>
        <div className=' bg-gray-500 m-5'>
          <p className=' text-4xl font-oswald'>Python Webscrape Weather HUD
          </p>
          <p>
            Sourced from www.weather.gc.ca, displayed with Tkinter
          </p>
        </div>
        <div className='bg-blue-200 px-10'>
          
        </div>
      </div>
    </div>
  );
};

export default pythonHUD;
