"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import projectsData from "../Data/Projects";

const IconImage = ({ src, alt }) => (
  <div
    className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    title={alt}
  >
    <Image
      src={src}
      width={34}
      height={34}
      style={{ objectFit: "contain" }}
      alt={alt}
      className="object-contain"
    />
  </div>
);

const GalleryPanel = ({ item }) => {
  if (!item) {
    return (
      <div className="flex h-full items-center justify-center rounded-[1.75rem] bg-slate-100 text-slate-500">
        Media preview coming soon.
      </div>
    );
  }

  if (item.type === "image") {
    return (
      <div
        className={`relative h-full overflow-hidden rounded-[1.75rem] ${
          item.backgroundClassName || "bg-slate-100"
        }`}
      >
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 800px"
          className={`${
            item.fit === "contain" ? "object-contain p-4" : "object-cover"
          }`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] bg-gradient-to-br p-8 text-white ${item.gradient}`}
    >
      <div className="absolute inset-0 opacity-40">
        <div className="absolute -right-16 top-8 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/65">
          {item.eyebrow}
        </p>
        <h3 className="mt-4 max-w-xl text-3xl font-semibold md:text-4xl">
          {item.title}
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-white/85 md:text-base">
          {item.description}
        </p>
      </div>

      <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-2">
        {item.details?.map((detail) => (
          <div
            key={detail}
            className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/90 backdrop-blur"
          >
            {detail}
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap gap-2">
        {item.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/80"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  const galleryItems = project.media ?? [];
  const [mode, setMode] = useState(project.livePreview ? "preview" : "gallery");
  const [currentSlide, setCurrentSlide] = useState(0);
  const activeItem = galleryItems[currentSlide];

  const showGallery = () => setMode("gallery");
  const showPreview = () => setMode("preview");

  return (
    <article className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_360px]">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.09)] backdrop-blur">
        <div className="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-700">
              Project
            </p>
            <h2 className="mt-2 font-oswald text-3xl text-slate-900 md:text-4xl">
              {project.title}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.livePreview && (
              <button
                type="button"
                onClick={showPreview}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "preview"
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                Live Preview
              </button>
            )}
            {galleryItems.length > 0 && (
              <button
                type="button"
                onClick={showGallery}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  mode === "gallery"
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                Media Gallery
              </button>
            )}
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
          <div className="relative h-[360px] overflow-hidden rounded-[1.5rem] bg-white shadow-inner md:h-[430px]">
            {mode === "preview" && project.livePreview ? (
              <iframe
                src={project.livePreview}
                title={`${project.title} live preview`}
                className="h-full w-full border-0"
                loading="lazy"
              />
            ) : (
              <GalleryPanel item={activeItem} />
            )}
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              {mode === "preview"
                ? project.previewCaption
                : activeItem?.caption || project.caption}
            </p>

            {mode === "gallery" && galleryItems.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide(
                      (currentSlide - 1 + galleryItems.length) %
                        galleryItems.length
                    )
                  }
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Prev
                </button>
                <div className="flex gap-2">
                  {galleryItems.map((item, index) => (
                    <button
                      key={`${project.slug}-${item.title || index}`}
                      type="button"
                      aria-label={`Show slide ${index + 1}`}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        index === currentSlide
                          ? "w-8 bg-slate-900"
                          : "w-2.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide((currentSlide + 1) % galleryItems.length)
                  }
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <aside className="flex h-full flex-col rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.09)] backdrop-blur">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-700">
            Description
          </p>
          <div className="mt-4 space-y-4 text-[15px] leading-7 text-slate-600">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p>{children}</p>,
                ul: ({ children }) => (
                  <ul className="space-y-2 pl-5 marker:text-sky-500">{children}</ul>
                ),
                li: ({ children }) => <li>{children}</li>,
              }}
            >
              {project.galleryDescription}
            </ReactMarkdown>
          </div>
        </div>

        <div className="mt-8 space-y-5 border-t border-slate-200 pt-6">
          {project.tech?.map((section) => (
            <div key={`${project.slug}-${section.title}`}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                {section.title}
              </h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {section.items.map((img) => (
                  <IconImage key={`${project.slug}-${img.alt}`} src={img.src} alt={img.alt} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <Link
          href={`/Projects/${project.slug}`}
          className="mt-auto inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Open Project Page
        </Link>
      </aside>
    </article>
  );
};

export default function ProjectsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-700">
          Projects
        </p>
        <h2 className="mt-3 font-oswald text-4xl text-slate-900 md:text-5xl">
          A cleaner gallery with room for the work to breathe.
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          The layout keeps the same project-by-project logic, but organizes each
          piece into a dedicated media window and a focused description panel so
          the gallery feels easier to scan.
        </p>
      </div>

      <div className="space-y-8">
        {projectsData.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
