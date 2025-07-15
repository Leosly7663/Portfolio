"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import projectsData from "../Data/Projects";
import ReactMarkdown from 'react-markdown';

const IconImage = ({ src, alt }) => (
  <Image
    src={src}
    width={65}
    height={65}
    style={{ objectFit: "contain" }}
    alt={alt}
    className="object-cover rounded-md hover:scale-105 transition-transform duration-200 ease-in-out"
  />
);

export default function ProjectsPage() {
  return (
    <div className="space-y-8 mt-20 p-20">
      {projectsData.map((p) => (
        <div key={p.slug} className="bg-gradient-to-br from-stone-900 to-slate-950  bg-opacity-20 p-4 rounded-2xl flex-row flex justify-between">
          <div className="flex flex-col bg-slate-950 justify-between w-9/12 bg-opacity-80 rounded-xl p-4">
            <div className="prose prose-invert text-gray-400 mb-2">
              <ReactMarkdown >
                {p.description}
              </ReactMarkdown>
            </div>
            <Link
            href={`/projects/${p.slug}`}
            className="inline-block px-4 py-2 bg-gradient-to-t from-blue-950 self-end text-white font-semibold rounded-xl shadow-md transition-transform transform hover:scale-105 hover:shadow-lg hover:from-purple-500 hover:to-blue-600">
            View Project
            </Link>
          </div>
          {p.tech && (
            <div className="p-2 align-middle items-start text-center grid grid-cols-1 sm:grid-cols-2">
              {p.tech.map((section, i) => (
                <div key={i} className="flex items-center bg-opacity-70 flex-col space-y-2 mr-6 rounded-md bg-gray-800 pb-2">
                  <h4 className="text-gray-300 font-semibold mb-1 pt-2 px-2">{section.title}:</h4>
                  <div className="flex pb-2 flex-col gap-4">
                    {section.items.map((img, index) => (
                      <IconImage key={index} src={img.src} alt={img.alt} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      ))}
    </div>
  );
}