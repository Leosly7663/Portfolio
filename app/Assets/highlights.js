"use client"
import React from 'react';
import { useState } from 'react';
import { useRouter } from "next/navigation"
import Fetch from "../Components/Fetch.js"


const Highlight = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClick, setIsClick] = useState(false);
    const router = useRouter()
  return (
    <div className="w-full justify-center mt-5 pt-60 pb-60 flex flex-col items-center">
      
      
      <h2 className='text-5xl  text-white'>
        Ontario Weather
      </h2>
      <p className='text-white '>
        Live data collection, powered through Python Flask and GitHub Actions served 24 hours to React.js client  
      </p>
      <div className=' w-full mb-10 text-white rounded-lg pt-8 bg-gradient-to-t from-transparent via-black to-transparent'>
        <div className="h-96">
        <Fetch/>
        </div>
        <div className='flex justify-center space-x-10 text-lg text-gray-400 mb-14'>
            <button >
                See more data 
            </button>
            <button>
                Project Page
            </button>
            </div>
      </div>
      <h2 className='text-5xl  pb-6 text-white'>
        More Projects
      </h2>
      <div className='bg-[#66666647] w-11/12 flex flex-rw p-5 justify-evenly space-x-5 rounded-xl'>
        
        <div className="bg-black w-2/5 rounded-xl bg-opacity-95">
            <div className=''>
                <p className='text-white text-center border-b px-8 pt-4 pb-4 text-7xl font-oswald font-light'>
                    Python Webscrape HUD
                </p>
                <div className='flex justify-center'>
                    <p className=' p-2 btn rounded-md  my-4' onClick={() => router.push('/python-HUD')}>
                        View Project
                    </p>
                </div>
            </div>
        </div> 
        <div className="bg-black w-2/5 rounded-xl bg-opacity-95">
            <div className=''>
                <p className='text-white text-center border-b px-8 pt-4 pb-4 text-7xl font-oswald font-light'>
                    Resume Project
                </p>
                <div className='flex justify-center'>
                    <p className=' p-2 btn rounded-md  my-4' onClick={() => router.push('/ResumeScanner')}>
                        View Project
                    </p>
                </div>
            </div>
        <div className="bg-black w-2/5 rounded-xl bg-opacity-95">
            <div className=''>
                <p className='text-white text-center border-b px-8 pt-4 pb-4 text-7xl font-oswald font-light'>
                    Life of a Server App
                </p>
                <div className='flex justify-center'>
                    <p className=' p-2 btn rounded-md  my-4'  onClick={() => router.push('/LifeofaServer')}>
                        View Project
                    </p>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Highlight;