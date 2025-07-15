"use client"
import React from 'react';
import NavBar from '../Components/Menu';
import ImageCarousel from '../Components/slider.js';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const PythonHUD = () => {
    const router = useRouter()
  return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
          <div className="w-full px-4 py-8 bg-white shadow-lg rounded-lg">
            <div className='flex justify-between'> 
            <h1 className="text-3xl font-bold mb-4">Python Webscraper HUD Display Page</h1>
            <button className='text-xl pr-10' onClick={() => router.push('/')}>Back</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Figma Section */}
              <div className="bg-gray-200 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Figma Design</h2>
                {/* Figma embed code or image */}
                <div class="flex-3 flex justify-center">
                  <Image
                  src="/PythonHUDFigma.png"
                  width={800}
                  height={800}
                  alt="Picture of the author"
                  className=' object-cover'
                  />
                  </div>
              </div>
              {/* UML Section */}
              <div className="bg-gray-200 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">UML Diagram</h2>
                {/* UML Diagram image or description */}
                <div class="flex-3 flex justify-center">
                  <Image
                  src="/Webscrape_UML.png"
                  width={800}
                  height={800}
                  alt="Picture of the author"
                  className=' object-cover'
                  />
                  </div>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Notes</h2>
                {/* Link to GitHub repository */}
                <p className='text-lg '>
                  This is a solo project so all design, development and Implementation was done solely by me outside of school and work feel free to contact me at contact@leonardonigro.com for references and 
                  inquiries.<br/><br/>
                  This program is written in Python 3 it uses beautiful soup 4 for web scraping pillow for image rendering and tkinter for tk GUI<br/><br/>
                  I have been maintaining and working on this project for a few years now, the original was written in 2019 but I have just recently revived it and improved its functionality
                  <br/>
                  check out my source code on my <a href="https://github.com/Leosly7663/WebScrape-HUD-Python" className=' text-opacity-85 text-blue-600'>GitHub Repo</a>
                </p>
              </div>
            </div>
          </div>
    
        </div>
  );
};

export default PythonHUD;
