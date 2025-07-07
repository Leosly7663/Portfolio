import React from 'react';
import Image from 'next/image';

const ProjectTemplate = ({ title, date, description, tech, content }) => {
  return (
    <div className="p-8 max-w-3xl mx-auto text-white">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <p className="text-gray-400 text-sm">{date}</p>
      <p className="mt-4 text-lg">{description}</p>

      {/* Tech Section */}
      {Array.isArray(tech) && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Tech Stack</h2>
          {tech.map((section, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-gray-300">{section.title}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {section.items.map((item, i) => (
                  <Image
                    key={i}
                    src={item.src}
                    alt={item.alt}
                    width={40}
                    height={40}
                    className="rounded object-contain"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-base leading-relaxed whitespace-pre-line">
        {content}
      </div>
    </div>
  );
};

export default ProjectTemplate;