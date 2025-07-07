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
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: { value: "#000000" } },
        particles: {
          number: { value: 100 },
          size: { value: 3 },
          move: { enable: true, speed: 1 },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
        },
      }}
    />
  );
};

export default GradientTransition;
