"use client"
import React from 'react';
import Image from 'next/image'

import { useState } from 'react';

const projects = [
  { name: "Project 1", subtitle: "Subtitle 1" },
  { name: "Project 2", subtitle: "Subtitle 2" },
  { name: "Project 3", subtitle: "Subtitle 3" },
  { name: "Project 4", subtitle: "Subtitle 4" },
  { name: "Project 5", subtitle: "Subtitle 5" },
  { name: "Project 6", subtitle: "Subtitle 6" },
  { name: "Project 7", subtitle: "Subtitle 7" },
];

const highlights = [
    { name: "highlight 1", subtitle: "Subtitle 1" },
    { name: "highlight 2", subtitle: "Subtitle 2" },
  ];

const Highlight = ({ name, subtitle }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div className="project" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <div className="project-content">
          <h3 className="project-name">{name}</h3>
          {isHovered && <p className="project-subtitle">{subtitle}</p>}
        </div>
      </div>
    );
  };

const Project = ({ name, subtitle }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="project" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="project-content">
        <h3 className="project-name">{name}</h3>
        {isHovered && <p className="project-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};


const Projects = () => {

    return(

    <div class="bg-black bg-opacity-20 rounded-3xl p-2 mx-40 mt-96 flex-rw items-center justify-center">
          <div className="flex">
            {highlights.map((highlights, index) => (
              <Highlight key={index} name={highlights.name} subtitle={highlights.subtitle} />
            ))}
          </div>
          <div className="">
            {projects.map((project, index) => (
              <Project key={index} name={project.name} subtitle={project.subtitle} />
            ))}
          </div>
    </div>
    )
}
export default Projects;