"use client";

import React, { useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const GradientTransition = () => {
  const [isReady, setIsReady] = useState(false);
  const [engine, setEngine] = useState(null);

  useEffect(() => {
    const initParticles = async () => {
      if (engine) return; // prevent reloading
      const loadedEngine = await loadSlim();
      setEngine(() => loadedEngine);
      setIsReady(true);
    };
    initParticles();
  }, [engine]);

  const particlesOptions = {
    background: {
      color: {
        value: "#0d47a1",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 6,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };

  return isReady && engine ? (
    <Particles id="tsparticles" init={engine} options={particlesOptions} />
  ) : null;
};

export default GradientTransition;
