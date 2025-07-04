// Footer.js
import React from 'react';

const Footer = () => {
    return (
        <footer className=" bg-black py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-rw justify-between items-center">

                    <a href="https://github.com/Leosly7663" target="_blank" rel="noopener noreferrer" className="text-white ">
                        <img width="50" height="50" src="https://img.icons8.com/clouds/50/github.png" alt="github" /> GitHub
                    </a>

                    <a href="https://www.linkedin.com/in/leonardo-nigro-948513199/" target="_blank" rel="noopener noreferrer" className="text-white">
                        <img width="50" height="50" src="https://img.icons8.com/fluency/50/linkedin.png" alt="linkedin" /> LinkedIn
                    </a>

                    <a href="LeonardoNigroResume.pdf" target="_blank" rel="noopener noreferrer" className="text-white">
                        <img width="50" height="50" src="https://img.icons8.com/nolan/50/resume.png" alt="resume" /> Resume
                    </a>
                    
                    <a href="mailto:Contact@leonardonigro.com" className="text-white">
                        <img width="50" height="50" src="https://img.icons8.com/fluency/50/new-post.png" alt="new-post" /> Email
                    </a>

                </div>
            </div>
        </footer>
    );
};

export default Footer;