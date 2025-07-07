'use client';

import React from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const Page = () => {
  const particlesInit = async (engine) => {
    console.log("Loading engine...");
    await loadSlim(engine);
    console.log("Particles initialized!");
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: {
            enable: true,
            zIndex: -1,
          },
          background: {
            color: { value: "#000000" },
          },
          particles: {
            number: {
              value: 60,
              density: {
                enable: true,
                area: 800,
              },
            },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: {
              value: 0.5,
            },
            size: {
              value: { min: 1, max: 3 },
            },
            move: {
              enable: true,
              speed: 1.5,
              direction: "none",
              outModes: { default: "bounce" },
            },
          },
        }}
      />
      <h1 className="text-white text-3xl absolute top-10 left-10 z-10">Particles Visible</h1>
    </div>
  );
};

export default Page;
