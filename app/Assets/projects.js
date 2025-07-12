"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import projectsData from "../Data/Projects";

const IconImage = ({ src, alt }) => (
  <Image
    src={src}
    width={50}
    height={50}
    style={{ objectFit: "contain" }}
    alt={alt}
    className="rounded-full object-cover"
  />
);

export default function ProjectsPage() {
  return (
    <div className="space-y-8 mt-20 p-20">
      {projectsData.map((p) => (
        <div key={p.slug} className="bg-black bg-opacity-20 p-4 rounded-2xl flex-row flex">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-white">{p.title}</h2>
          <p className="text-gray-400 mb-2">{p.description}</p>
          <Link href={`/projects/${p.slug}`} className="text-blue-400 underline">
            View Project
          </Link>
          </div>
          <div className="flex flex-col items-center justify-center ml-4">
            {p.tech && (
            <div className="mt-4 space-y-2 p-4  flex flex-row">
              {p.tech.map((section, i) => (
                <div key={i} className=" flex flex-row">
                  <h4 className="text-gray-300 mb-1">{section.title}:</h4>
                  <div className="flex space-x-2">
                    {section.items.map((img, index) => (
                      <IconImage key={index} src={img.src} alt={img.alt} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      ))}
    </div>
  );
}