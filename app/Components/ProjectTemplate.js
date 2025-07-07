import React from 'react';

const ProjectTemplate = ({ title, date, description, tech, content }) => {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <p className="text-gray-500">{date}</p>
      <p className="mt-4 text-lg">{description}</p>
      <ul className="flex flex-wrap mt-4 gap-2">
        {tech.map((t) => (
          <li key={t} className="bg-gray-200 px-3 py-1 rounded">{t}</li>
        ))}
      </ul>
      <div className="mt-6 text-base leading-relaxed">
        {content}
      </div>
    </div>
  );
};

export default ProjectTemplate;
