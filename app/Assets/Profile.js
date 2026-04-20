"use client";

import React from "react";

const TitleCard = () => {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-36">
      <div className="rounded-[2.5rem] border border-white/80 bg-white/76 px-8 py-12 shadow-[0_30px_100px_rgba(15,23,42,0.12)] backdrop-blur md:px-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-700">
          Personal Portfolio
        </p>
        <h1 className="mt-6 font-oswald text-5xl leading-none text-slate-900 md:text-7xl">
          Leonardo Pietro Nigro
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
          Computer engineering student building thoughtful digital experiences,
          useful products, and a portfolio that feels more human than a resume.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            Product-minded builder
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            Design-aware development
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            Based in Ontario
          </span>
        </div>
      </div>
    </section>
  );
};

export default TitleCard;
