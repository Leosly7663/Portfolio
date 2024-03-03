"use client"
import React from 'react';
import { useState } from 'react';
import { useRouter } from "next/navigation"




const Highlight = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClick, setIsClick] = useState(false);
    const router = useRouter()
  return (
    <div className="w-full justify-center mt-5 pt-60 pb-60 flex flex-col items-center">
      <h2 className='text-5xl  pb-6 text-white'>
        My Highlights
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