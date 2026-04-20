"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const aboutSlides = [
  {
    mediaType: "image",
    media: "/about-trips/IMG_5347.JPEG",
    eyebrow: "New York",
    title: "Late Nights In The City",
    text: "New York brought the fast pace part of the trip: bright streets, long walks, and the kind of energy that makes you want to stay out a little longer just to take it all in.",
  },
  {
    mediaType: "image",
    media: "/about-trips/IMG_5420.JPG",
    eyebrow: "New York",
    title: "A Trip Worth Remembering",
    text: "I wanted this section to feel more personal, so I pulled in moments from this trip instead of writing another polished summary. It felt more honest to show the places that stuck with me.",
  },
  {
    mediaType: "image",
    media: "/about-trips/IMG_7645.JPEG",
    eyebrow: "Rochester",
    title: "Quieter Stops Matter Too",
    text: "Rochester had a totally different pace. It was calmer, more open, and a good reminder that some of the best parts of a trip are the slower moments in between the big headline destinations.",
  },
  {
    mediaType: "image",
    media: "/about-trips/IMG_9131.JPEG",
    eyebrow: "BC Ski Trip",
    title: "Ski Days Are Still My Favourite",
    text: "BC was the skiing chapter of the trip, and easily one of my favourite parts. I love the cold mornings, the gear-up routine, and that reset you get after a full day on the mountain.",
  },
  {
    mediaType: "video",
    media: "/about-trips/IMG_9131.MOV",
    eyebrow: "BC Ski Trip",
    title: "The Kind Of Break I Always Come Back To",
    text: "Trips like this are a big part of who I am outside of work. Skiing clears my head, gives me something physical to chase, and usually leaves me coming back with better ideas.",
  },
  {
    mediaType: "image",
    media: "/about-trips/IMG_9163.JPEG",
    eyebrow: "BC Ski Trip",
    title: "Snow, Quiet, And A Reset",
    text: "That BC snow felt like the perfect contrast to the city side of the trip. It was quiet, cold, and exactly the kind of environment that helps me slow down and enjoy the moment.",
  },
];

const aboutHighlights = [
  "Ontario based",
  "New York memories",
  "Rochester stops",
  "BC ski trips",
];

const About = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % aboutSlides.length);
    }, 5500);

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
              More of the person behind the work.
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-8 text-slate-600">
              <p>
                I&apos;m Leo, from Ontario, and I want this part of the site to
                feel more like a real introduction than a resume paragraph. A
                lot of what shapes me happens outside of a screen, especially on
                trips where I get to explore, ski, and take a step back from the
                usual pace.
              </p>
              <p>
                This set of photos comes from a trip through New York,
                Rochester, and BC. I like that it holds a bit of everything:
                city energy, quieter in-between stops, and the ski days that
                always end up being the highlight for me.
              </p>
              <p>
                Skiing has been one of the most consistent things in my life for
                a long time. It gives me a reset, keeps me outdoors, and
                honestly makes me feel more like myself. That balance between
                movement, curiosity, and calm is something I try to bring into
                my work too.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {aboutHighlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 shadow-inner">
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <div className="absolute left-4 top-4 z-10 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 backdrop-blur">
                {currentSlide.eyebrow}
              </div>
              <div className="relative aspect-[4/5] w-full">
                {currentSlide.mediaType === "video" ? (
                  <>
                    <video
                      key={currentSlide.media}
                      src={currentSlide.media}
                      className="h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                  </>
                ) : (
                  <>
                    <Image
                      src={currentSlide.media}
                      alt={currentSlide.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 420px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />
                  </>
                )}
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
                    key={`${slide.title}-${index}`}
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
