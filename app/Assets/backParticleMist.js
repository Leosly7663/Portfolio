'use client';

import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function TestPage() {
  const particlesInit = async (engine) => {
    console.log('✅ Particles initializing...');
    await loadSlim(engine);
    console.log('✅ Slim engine loaded');
  };

  return (
    <div className="relative h-screen bg-black">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true, zIndex: -1 },
          background: { color: { value: '#000000' } },
          particles: {
            number: { value: 60, density: { enable: true, area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 4 } },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              outModes: { default: 'bounce' },
            },
          },
        }}
      />
      <h1 className="absolute top-10 left-10 text-white text-3xl z-10">Particles Test Page</h1>
    </div>
  );
}
