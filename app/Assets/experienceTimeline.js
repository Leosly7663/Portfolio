import React from 'react';
import Image from 'next/image';



const experiencesData = [
  {
    photo: 'Gov-can.ico',
    title: 'Software Developer Co-op',
    mainText: 'Sole developer of a department-wide Photo Contest portal and co-led a Conflict of Interest Declaration System for over 100,000 users. Managed full SDLC, led Agile sprint planning, and implemented Microsoft Entra ID for secure role-based access.',
    date: 'June 2024 – June 2025',
  },
  {
    photo: 'aws-icon.ico',
    title: 'Student Software Developer',
    mainText: 'Worked on an E-Commerce platform using AWS EC2/RDS and a monolithic architecture. Built scalable React components with TypeScript and maintained CI workflows through GitHub project tracking.',
    date: 'April 2023 – Dec 2023',
  },
  {
    photo: 'tutorax.ico',
    title: 'Tutor (Contractor) – Tutorax',
    mainText: 'Delivered one-on-one tutoring sessions for Grade 11 and 12 students in Physics, Mathematics, and Computer Science. Adapted complex concepts into accessible lessons, fostering academic success and confidence in STEM subjects.',
    date: '2022 – 2024',
  },
];

const ExperienceItem = ({ photo, title, mainText, date }) => (
  <div className="flex items-start space-x-4 py-4 border-b border-gray-700">
    <Image
      src={photo}
      width={60}
      height={60}
      alt={title}
      className="rounded-full object-cover"
    />
    <div>
      <h3 className="text-xl text-white font-semibold">{title}</h3>
      <p className="text-gray-400 text-sm mb-2">{date}</p>
      <p className="text-gray-300 text-base">{mainText}</p>
    </div>
  </div>
);

const ExperienceTimeline = () => (
  <div className="bg-black bg-opacity-20 rounded-3xl p-6 mx-40 my-10">
    {experiencesData.map((exp, index) => (
      <ExperienceItem
        key={index}
        photo={exp.photo}
        title={exp.title}
        mainText={exp.mainText}
        date={exp.date}
      />
    ))}
  </div>
);

export default ExperienceTimeline;
