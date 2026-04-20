import React from "react";
import Image from "next/image";

const experiencesData = [
  {
    photo: "Gov-can.ico",
    title: "Software Developer Co-op",
    employer:
      "Environment and Climate Change Canada - Digital Services Branch - Power Platform Solutions",
    mainText:
      "Built and supported internal platforms used at scale, including a department-wide photo contest portal and a conflict of interest declaration system. I worked across planning, delivery, and refinement with a strong focus on usability and reliability.",
    date: "June 2024 - June 2025",
  },
  {
    photo: "aws-icon.ico",
    title: "Student Software Developer",
    employer: "Life of a Server Inc. - Mobile App and E-Commerce Platform",
    mainText:
      "Helped shape an e-commerce platform running on AWS infrastructure, built React components in TypeScript, and supported delivery workflows through GitHub-based project tracking.",
    date: "April 2023 - Dec 2023",
  },
  {
    photo: "tutorax.ico",
    title: "Private Secondary Tutor",
    employer: "Tutorax - Contract",
    mainText:
      "Delivered one-on-one tutoring in physics, mathematics, and computer science, translating difficult material into practical, approachable lessons for senior high school students.",
    date: "2022 - 2024",
  },
];

const ExperienceItem = ({ photo, title, employer, mainText, date }) => (
  <div className="flex flex-col gap-4 border-b border-slate-200 py-6 sm:flex-row sm:items-start">
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
      <Image
        src={`/${photo}`}
        width={42}
        height={42}
        alt={title}
        className="rounded-full object-cover"
      />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm font-medium text-sky-700">{employer}</p>
      <p className="mt-1 text-sm text-slate-400">{date}</p>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
        {mainText}
      </p>
    </div>
  </div>
);

const ExperienceTimeline = () => (
  <section className="mx-auto max-w-6xl px-6 py-8">
    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.09)] backdrop-blur md:p-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-700">
          Experience
        </p>
        <h2 className="mt-3 font-oswald text-4xl text-slate-900 md:text-5xl">
          Places where I learned to ship real work.
        </h2>
      </div>

      <div className="mt-8">
        {experiencesData.map((exp) => (
          <ExperienceItem
            key={`${exp.title}-${exp.date}`}
            photo={exp.photo}
            title={exp.title}
            employer={exp.employer}
            mainText={exp.mainText}
            date={exp.date}
          />
        ))}
      </div>
    </div>
  </section>
);

export default ExperienceTimeline;
