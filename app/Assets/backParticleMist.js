"use client";

import React from "react";
import Particles from "@tsparticles/react";
import { loadFull } from "@tsparticles/react";

const GradientTransition = () => {
  const particlesInit = async (main) => {
    // Loads tsparticles engine with all features
    await loadFull(main);
  };

  const particlesOptions = {
    fullScreen: { enable: true },
    background: {
      color: { value: "transparent" },
    },
    particles: {
      number: {
        value: 450,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: "#bbbbbb",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: { min: 0.1, max: 0.7 },
        animation: {
          enable: true,
          speed: 0.5,
          minimumValue: 0,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 3 },
        animation: {
          enable: false,
        },
      },
      move: {
        enable: true,
        speed: { min: 0.1, max: 0.4 },
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out",
        },
      },
    },
    detectRetina: true,
  };

  return <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />;
};

export default GradientTransition;