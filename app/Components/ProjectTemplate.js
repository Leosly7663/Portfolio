"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Github } from "lucide-react";

const ProjectTemplate = ({
  title,
  date,
  description,
  tech,
  content,
  demo,
  repo,
  images = [],
}) => {
  return (
    <div className="min-h-screen bg-transparent px-6 py-12 text-slate-900">
      <header className="mx-auto max-w-5xl rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.09)] backdrop-blur md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-700">
          Project Detail
        </p>
        <h1 className="mt-4 font-oswald text-4xl leading-tight text-slate-900 md:text-6xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-400">{date}</p>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {demo && (
            <Link
              href={demo}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Open Live Demo
            </Link>
          )}
          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              <Github size={18} />
              GitHub
            </a>
          )}
        </div>
      </header>

      {Array.isArray(tech) && tech.length > 0 && (
        <section className="mx-auto mt-8 max-w-5xl rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.09)] backdrop-blur">
          <h2 className="font-oswald text-3xl text-slate-900">Tech Stack</h2>
          <div className="mt-6 space-y-6">
            {tech.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
                  {section.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-4">
                  {section.items.map((item) => (
                    <div
                      key={`${section.title}-${item.alt}`}
                      className="group flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      title={item.alt}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={36}
                        height={36}
                        className="rounded object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="prose prose-slate mx-auto mt-8 max-w-5xl rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.09)] backdrop-blur md:p-10">
        <ReactMarkdown>{content}</ReactMarkdown>
      </section>

      {images.length > 0 && (
        <section className="mx-auto mt-8 max-w-5xl rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.09)] backdrop-blur">
          <h2 className="font-oswald text-3xl text-slate-900">Screenshots</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {images.map((img, index) => (
              <div
                key={img}
                className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100"
              >
                <Image
                  src={img}
                  alt={`Screenshot ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
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
