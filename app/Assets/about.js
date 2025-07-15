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
              src="/newpfp.jpg"
              width={100}
              height={100}
              alt="Picture of the author"
              className="w-48 h-48 ml-10  object-contain rounded-full "
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
          With over five years of experience in software development, including two years dedicated to building enterprise-grade applications, I bring a strong foundation in both academic and professional environments. This portfolio is powered by a modern full-stack architecture using React, Node.js, and Next.js, hosted on Vercel.
          <br /><br />
          My technical strengths include designing scalable microservices, developing secure and functional applications, and managing end-to-end software delivery. I've led development efforts on high-impact government systems, implemented role-based access control with Microsoft Entra ID, and built dynamic, user-focused platforms using the Microsoft Power Platform, Azure, and SharePoint.
          <br /><br />
          I approach challenges as opportunities to innovate and refine my skills—whether it's prototyping with Figma, writing Python-based data analysis pipelines, or building UI-rich applications in TypeScript and React. I invite you to explore the highlights section for various projects showcasing my expertise in Python, React, web-scraping, and ML.
        </p>
      </div>
    </div>
  );
};

export default About;
