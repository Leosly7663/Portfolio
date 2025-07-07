"use client";

import React from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const GradientTransition = () => {
  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 }, // THIS ensures it's layered behind everything
        background: { color: { value: "#0d47a1" } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "repulse" },
            resize: true,
          },
          modes: {
            push: { quantity: 4 },
            repulse: { distance: 100, duration: 0.4 },
          },
        },
        particles: {
          color: { value: "#ffffff" },
          links: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.5,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            outModes: { default: "bounce" },
          },
          number: {
            value: 80,
            density: { enable: true, area: 800 },
          },
          opacity: { value: 0.5 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
    />
  );
};

export default GradientTransition;
