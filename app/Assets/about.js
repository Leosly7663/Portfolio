"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const aboutSlides = [
  {
    image: "/newpfp.jpg",
    eyebrow: "Where I'm From",
    title: "Rooted in Ontario",
    text: "I grew up in a close-knit corner of Ontario where winter lasts long enough for snow to shape the rhythm of everyday life. That sense of calm, space, and consistency still shows up in the way I approach the things I make.",
  },
  {
    image: "/pfp3.jpg",
    eyebrow: "Outside of Work",
    title: "Skiing Is My Reset Button",
    text: "Ski days are still some of my favourites. I love the early starts, the cold air, and the feeling of clearing my head on the mountain before coming back with fresh energy.",
  },
  {
    image: "/PFP.jpg",
    eyebrow: "What Matters to Me",
    title: "Thoughtful, Personal Work",
    text: "I care a lot about making things that feel considered and approachable. Whether it is a portfolio, a tool, or a side project, I like work that feels polished without losing personality.",
  },
];

const About = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % aboutSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = aboutSlides[activeSlide];

  return (
    <section className="mx-auto max-w-6xl px-6 pb-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="grid gap-10 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-700">
              About Me
            </p>
            <h2 className="mt-4 font-oswald text-4xl text-slate-900 md:text-5xl">
              A little more personal, a little less polished in the corporate sense.
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-8 text-slate-600">
              <p>
                I&apos;m Leo, and I like building things that feel clean, useful,
                and easy to connect with. The technical side matters to me, but
                I&apos;m just as interested in the experience around it: how it
                feels, how it reads, and whether it leaves a good impression.
              </p>
              <p>
                I&apos;m from Ontario, and for now this section leans into the
                parts of my story that feel most like me outside of code. Skiing
                has always been one of those anchors. It keeps me balanced, gets
                me outside, and reminds me that some of the best ideas come when
                you step away for a bit.
              </p>
              <p>
                I want this portfolio to feel like a real introduction, not just
                a technical summary. So over time I&apos;ll keep adding more of
                the places, hobbies, and moments that shaped how I work.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                Based in Ontario
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                Loves ski season
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                Enjoys thoughtful design
              </span>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 shadow-inner">
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <div className="absolute left-4 top-4 z-10 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 backdrop-blur">
                {currentSlide.eyebrow}
              </div>
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 420px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-semibold">{currentSlide.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/85">
                    {currentSlide.text}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                {aboutSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    aria-label={`Show ${slide.title}`}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeSlide
                        ? "w-8 bg-slate-900"
                        : "w-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide(
                      (activeSlide - 1 + aboutSlides.length) % aboutSlides.length
                    )
                  }
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((activeSlide + 1) % aboutSlides.length)
                  }
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
