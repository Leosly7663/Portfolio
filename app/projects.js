"use client"
import React from 'react';
import { useRouter } from 'next/navigation'

import { useState } from 'react';
import ImageCarousel from './slider.js';




function ChildComponent(props) {
  const handleClick = (e) => {
    // Prevent propagation to the parent component
    e.stopPropagation();
    // Handle your child component's click event here
  };

  return (
    <div onClick={handleClick} className='flex justify-center'>
      <div className='text-center bg-[#a8a8aa] fixed px-10 py-10 space-x-10 w-4/5 h-5/6 top-24 justify-center flex rounded-xl'>
        <div className=' bg-[#4e4e5215] text-center w-full rounded-xl p-5 text-lg'>
          {props.des}
        </div>
        <div className="pt-5 w-1/2 text-xl font-bold">
          {props.name}
          <div className='pt-5 font-normal text-base'>
            <ImageCarousel/>
          </div>
        </div>
        
      </div>
    </div>
  );
}

const highlights = [
    { 
      name: "Python Webscrape HUD",
      subtitle: "Subtitle 1", 
      des: "Description\:\nThe Webscraped HUD fetches weather information from a website and displays it in a Tkinter shell. It serves as a real-world application, showcasing skills in application design.\n\nFeatures:\na. Web Scraping\nUtilizes web scraping to extract real-time weather data.\nUpdates information dynamically.\nb. Tkinter User Interface\nProvides an interactive Tkinter shell for user-friendly display.\nWell-designed GUI for an enhanced user experience.\nc. Real-world Application\nPractical application of web scraping and GUI design.\nHighlights skills in creating functional and aesthetically pleasing applications.",
  },
    { name: "React Native Highlight", subtitle: "Subtitle 2" },
  ];

const Highlight = ({ name, subtitle, des }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClick, setIsClick] = useState(false);
  
    return (
      <div>
        <div className=" highlight" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={() => setIsClick(!isClick)}>
          <div className="highlight-content">
            <h3 className="highlight-name">{name}</h3>
          </div>
        </div>

      {isClick && <div className="w-full absolute inset-x-0 inset-y-0 bg-[#00000036]"  onClick={() => setIsClick(!isClick)}>
            <ChildComponent name={name} des={des}/>
          </div>}
      </div>
      
    );
  };



const Projects = () => {

    return(

    <div class="bg-gray-900 bg-opacity-60 mb-20 pb-10 rounded-3xl p-2 mx-40 mt-40 flex flex-col items-center justify-center">
          <h2 className='text-5xl  py-4 text-white'>
            Smaller Projects
          </h2>
          <div className="flex justify-center flex-col items-center highlights w-3/5">
            {highlights.map((highlights, index) => (
              <Highlight key={index} name={highlights.name} des={highlights.des} subtitle={highlights.subtitle} />
            ))}
          </div>
        </div>
    )
}
export default Projects;