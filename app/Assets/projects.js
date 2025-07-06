"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const projectsData = [
  {
    slug: "This-Portfolio",
    title: "This Portfolio",
    description: "An interactive dashboard built with React and Chart.js for visualizing business metrics.",
    tech: [
      {
        title: "Front-End",
        items: [
          { src: "/react-2.svg", alt: "React Icon" },
          { src: "/tailwind-css-2.svg", alt: "Tailwind Icon" }
        ]
      },
      {
        title: "Hosting",
        items: [
          { src: "/vercel_favicon.svg", alt: "Vercel Icon" }
        ]
      },
      {
        title: "CI CD",
        items: [
          { src: "/vercel_favicon.svg", alt: "Vercel Icon" }
        ]
      }
    ]
  },
  {
    slug: "node-api",
    title: "Node.js API",
    description: "RESTful API developed with Node.js and Express, featuring JWT authentication and MongoDB integration.",
    tech: [
      {
        title: "Back-End",
        items: [
          { src: "/nodejs-icon.svg", alt: "Node.js Icon" },
          { src: "/mongodb.svg", alt: "MongoDB Icon" }
        ]
      }
    ]
  },
  {
    slug: "nextjs-blog",
    title: "Next.js Blog",
    description: "A statically generated blog using Next.js with Markdown support and dynamic routing.",
    tech: [
      {
        title: "Front-End",
        items: [
          { src: "/next-js.svg", alt: "Next.js Icon" }
        ]
      }
    ]
  },
  {
    slug: "tailwind-ui-kit",
    title: "Tailwind UI Kit",
    description: "A collection of reusable UI components styled with Tailwind CSS for rapid development.",
    tech: [
      {
        title: "Front-End",
        items: [
          { src: "/tailwind-css-2.svg", alt: "Tailwind Icon" }
        ]
      }
    ]
  }
];

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
    <div className="space-y-8">
      {projectsData.map((p) => (
        <div key={p.slug} className="bg-black bg-opacity-20 p-4 rounded-2xl">
          <h2 className="text-xl font-semibold text-white">{p.title}</h2>
          <p className="text-gray-400 mb-2">{p.description}</p>
          <Link href={`/projects/${p.slug}`} className="text-blue-400 underline">
            View Project
          </Link>
          {p.tech && (
            <div className="mt-4 space-y-2">
              {p.tech.map((section, i) => (
                <div key={i}>
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
      ))}
    </div>
  );
}