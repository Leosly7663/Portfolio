"use client"
import React from 'react';
import NavBar from '../Menu';
import Image from 'next/image'
import { useRouter } from 'next/navigation';

const LifeofaServer = () => {
  const router = useRouter()
  return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
          <div className="w-full px-4 py-8 bg-white shadow-lg rounded-lg">
            <div className='flex justify-between'> 
            <h1 className="text-3xl font-bold mb-4">Life of a Server React Native App Display Page</h1>
            <button className='text-xl pr-10' onClick={() => router.push('/')}>Back</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Figma Section */}
              <div className="bg-gray-200 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Figma Design</h2>
                {/* Figma embed code or image */}
                <div class="flex-3 flex justify-center">
                  <Image
                  src="/LOAS_Figma.png"
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
                  src="/LOAS_UML.jpg"
                  width={800}
                  height={800}
                  alt="Picture of the author"
                  className=' object-cover'
                  />
                  </div>
              </div>
              {/* Git Section */}
              <div className="bg-gray-200 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Git History and Branch Maintenance</h2>
                {/* Link to GitHub repository */}
                <div class="flex-3 flex justify-center">
                  <Image
                  src="/LOAS_git.png"
                  width={800}
                  height={800}
                  alt="Picture of the author"
                  className='object-cover'
                  />
                  </div>
              </div>
              <div className="bg-gray-200 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Notes</h2>
                {/* Link to GitHub repository */}
                <p className='text-lg '>
                  This is a solo project so all design, development and Implementation is the intellectual and legal property of Leonardo Nigro and Life of a Server Inc.
                  Due to company policy a Git Repo cannot be displayed for security reasons but feel free to contact us at contact@leonardonigro.com for references and 
                  inquiries.<br/><br/>
                  This app is written in React Native, we use Firebase for user data as we are a low server cost application running step tracking, and tip tracking
                  for the service industry <br/><br/>
                  My personal impact at Life of a Server started as a technology consultant but as I grew close with the team I offered my skills in development and since then we have
                  been working on v2.0.0 of the Life of a Server app, transitioning their old PHP tech stack to a more modern framework. I have learned a fantastic amount in this position
                  and I have really started to understand to scope of an application and how a team is built and ran.
                </p>
              </div>
            </div>
          </div>
    
        </div>
      );
    };
    

export default LifeofaServer
