import React from 'react';
import Image from 'next/image';

const experiencesData = [
  {
    photo: 'react-2.svg',
    title: 'React Developer',
    mainText: 'Built dynamic front-end interfaces using React and Tailwind CSS, focusing on responsive design and user experience.',
    date: '2019 – 2021',
  },
  {
    photo: 'nodejs-icon.svg',
    title: 'Backend Engineer',
    mainText: 'Developed RESTful APIs and microservices in Node.js, integrating with enterprise systems and ensuring scalability.',
    date: '2021 – 2022',
  },
  {
    photo: 'next-js.svg',
    title: 'Full-Stack Developer',
    mainText: 'Created server-side rendered applications with Next.js, enhancing performance and SEO for high-traffic platforms.',
    date: '2022 – 2023',
  },
  {
    photo: 'Vercel_favicon.svg',
    title: 'Deployment Specialist',
    mainText: 'Led deployment pipelines with Vercel, automating CI/CD workflows to streamline release cycles.',
    date: '2023',
  },
  {
    photo: 'tailwind-css-2.svg',
    title: 'UI/UX Designer',
    mainText: 'Designed and implemented clean, modern user interfaces leveraging Tailwind CSS and component-driven architecture.',
    date: '2023 – Present',
  },
];

const ExperienceItem = ({ photo, title, mainText, date }) => (
  <div className="flex items-start space-x-4 py-4 border-b border-gray-700">
    <Image
      src={`/library/${photo}`}
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
