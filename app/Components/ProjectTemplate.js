'use client';
import Link from "next/link";
import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Github, ExternalLink } from 'lucide-react';

const ProjectTemplate = ({ title, date, description, tech, content, demo, repo, images = [] }) => {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-10">
      {/* Header */}
      <header className="mb-10 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight">{title}</h1>
        <p className="text-sm text-gray-400 mt-1">{date}</p>
        <p className="mt-4 text-lg italic text-gray-300">{description}</p>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          {demo && (
            <Link
             href={demo}
            className="inline-block px-4 py-2 bg-gradient-to-t from-blue-950 self-end text-white font-semibold rounded-xl shadow-md transition-transform transform hover:scale-105 hover:shadow-lg hover:from-purple-500 hover:to-blue-600">
            Open Live Demo
            </Link>
          )}
          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border px-4 py-2 rounded hover:bg-opacity-10"
            >
              <Github size={18} />
              GitHub
            </a>
          )}
        </div>
      </header>

      {/* Tech Stack */}
      {Array.isArray(tech) && tech.length > 0 && (
        <section className="mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
          <div className="space-y-6">
            {tech.map((section, i) => (
              <div key={i}>
                <h3 className="text-lg font-medium text-gray-300 mb-2">{section.title}</h3>
                <div className="flex flex-wrap gap-4">
                  {section.items.map((item, j) => (
                    <div
                      key={j}
                      className="w-12 h-12 relative group hover:scale-110 transition-transform"
                      title={item.alt}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        layout="fill"
                        objectFit="contain"
                        className="rounded"
                      />
                      <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.alt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Content */}
      <section className="prose prose-invert max-w-4xl mx-auto text-gray-200 mb-12">
        <ReactMarkdown>{content}</ReactMarkdown>
      </section>

      {/* Screenshots */}
      {images.length > 0 && (
        <section className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((img, i) => (
              <div key={i} className="relative w-full aspect-[4/3] rounded overflow-hidden border">
                <Image
                  src={img}
                  alt={`Screenshot ${i + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform hover:scale-105 duration-300"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProjectTemplate;
