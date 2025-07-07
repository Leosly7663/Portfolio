'use client';

import React from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const TestParticles = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <div className="relative h-screen bg-black">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: 0 },
          background: {
            color: { value: "#000000" },
          },
          particles: {
            number: { value: 50 },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            size: { value: 4 },
            move: {
              enable: true,
              speed: 1,
            },
          },
        }}
      />
      <h1 className="absolute top-10 left-10 text-white text-3xl z-10">Hello Particles</h1>
    </div>
  );
};

export default TestParticles;
