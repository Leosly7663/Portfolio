import React from 'react';
import Image from 'next/image';

const IconImage = ({ src, alt }) => (
  <Image
    src={src}
    width={80}
    height={80}
    style={{ objectFit: 'contain' }}
    alt={alt}
    className="rounded-full object-cover"
  />
);

const About = () => {
  return (
    <div className="bg-black bg-opacity-20 rounded-3xl p-2 mx-40 mt-96">
        
      {/* Top Section */}
      <div className="flex items-center space-x-10 p-4 justify-center w-full">
        <div className="flex-3 flex justify-center">
            <Image
              src="/pfp3.jpg"
              width={200}
              height={200}
              alt="Picture of the author"
              className="rounded-full object-cover"
            />
          </div>
          <div>
              <div className="flex flex-auto">
                    <p className="text-white text-7xl">Hi, I'm Leo 👋</p>
                </div>
                
                <div className=" pt-2 text-xl flex-auto text-gray-300 flex items-center  rounded-2xl">
                    This is a little section all about me </div>
          </div>
        
      </div>

      {/* Text Content */} 
      <div className="flex-1 p-10 text-2xl text-gray-300">
        <p className="text-center">
          With a solid foundation spanning five years in coding and project development,
          I've recently transitioned into the professional realm, dedicating the last two years
          to crafting enterprise-grade applications. Powering this portfolio is a dynamic blend
          of React, Node.js, and Next.js, with Vercel serving as the hosting platform.
          <br />
          My expertise lies in delivering robust software engineering solutions,
          with a keen focus on microservice development and functional software services.
          Challenges invigorate me, as they offer opportunities to push boundaries
          and enhance my skill set continually. I invite you to explore my highlights section,
          where you'll find a showcase of my object-oriented programming prowess,
          notably in Python and C.
        </p>
      </div>
    </div>
  );
};

export default About;
