"use client";
import React, { useState } from 'react';
import Highlights from './highlights';

const projects = [
  { name: "Project 1", subtitle: "Subtitle 1" },
  { name: "Project 2", subtitle: "Subtitle 2" },
  { name: "Project 3", subtitle: "Subtitle 3" },
  { name: "Project 4", subtitle: "Subtitle 4" },
  { name: "Project 5", subtitle: "Subtitle 5" },
  { name: "Project 6", subtitle: "Subtitle 6" },
  { name: "Project 7", subtitle: "Subtitle 7" },
];

const Project: React.FC<{ name: string, subtitle: string }> = ({ name, subtitle }) => {
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

const App: React.FC = () => {
  return (
    <div className="App bg-gray-800 h-screen text-gray-200 overflow-y-scroll flex items-center justify-center">
      <div className="portfolio flex flex-col items-center justify-center">
        <div>
          <Highlights  subtitle="applications"/>
        </div>
        <div>hard skills</div>
          <div className="branch">
            {projects.slice(0, 2).map((project, index) => (
              <Project key={index} name={project.name} subtitle={project.subtitle} />
            ))}
          </div>
        <div className="projects flex mt-10">
          <div className="branch">
            {projects.slice(2,4).map((project, index) => (
              <Project key={index + 2} name={project.name} subtitle={project.subtitle} />
            ))}
          </div>
          <div className="branch">
            {projects.slice(4).map((project, index) => (
              <Project key={index + 4} name={project.name} subtitle={project.subtitle} />
            ))}
          </div>
        </div>
        <div className="about-me mt-10 text-center">
          <h2>About Me</h2>
          <p>This is the about me section...</p>
          <p>I like to ski, I like to travel, I like to cook</p>
        </div>
      </div>
    </div>
  );
};

export default App;
