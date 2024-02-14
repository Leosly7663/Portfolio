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
            I have been coding and building projects for 5 years now and in the last 2 years I've entered the workforce building enterprise level applications. This website is running React, Node.js, Next.js and hosted by Vercel.
            My skill set is oriented around Software Engineering solutions, notably in microservice development and functional software services. I do not shy away from a challenge I am always looking for
            new ways to expand my skills. I encourage you to look further into my object oriented programming most notably in Python and C in my highlights section. 
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