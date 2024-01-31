import React from 'react';
import Image from 'next/image'

const About = () => {

    return(

    <div class="bg-black bg-opacity-20 rounded-3xl p-2 flexitems-center mx-40 mt-96">
        <div className='flex items-center space-x-10 p-4 justify-center'>
            <div class="flex-3 flex justify-center">
            <Image
            src="/pfp3.jpg"
            width={200}
            height={400}
            alt="Picture of the author"
            className='rounded-full object-cover'
            />
            </div>
            <div class="flex h-full ">
                <p class="text-white text-8xl">Hi I'm Leo 👋</p>
            </div>
        </div>


        <div class="flex-1 p-10 text-2xl text-gray-300">
            I am a software engineer from Guelph Ontario. I have been coding and building projects for 5 years now and in the last 2 years I've upgraded my skills from simple functional projects for school to 
            fully functional enterprise level applications. This website I built myself running React, Node.js, and Next.js and hosted by Vercel. While this might not be the prettiest I encourage you to look
            further into my object oriented programming most notably in Python and C to see where my true talent lies in data manipulation and technical programming.
            <div className='flex justify-center space-x-5'>
            <Image
            src="/react-2.svg"
            width={80}
            height={80}
            style={{objectFit:"contain"}}
            alt="Picture of the author"
            className='rounded-full object-cover'
            />
            <Image
            src="/tailwind-css-2.svg"
            width={80}
            height={80}
            style={{objectFit:"contain"}}
            alt="Picture of the author"
            className='rounded-full object-cover'
            />
            <Image
            src="/nodejs-icon.svg"
            width={80}
            height={80}
            style={{objectFit:"contain"}}
            alt="Picture of the author"
            className='rounded-full object-cover'
            />
            <Image
            src="/next-js.svg"
            width={80}
            height={80}
            style={{objectFit:"contain"}}
            alt="Picture of the author"
            className='rounded-full object-cover'
            />
            <Image
            src="/Vercel_favicon.svg"
            width={80}
            height={80}
            style={{objectFit:"contain"}}
            alt="Picture of the author"
            className='rounded-full object-cover'
            />
            </div>
            
        </div>
    </div>
    )
}
export default About;