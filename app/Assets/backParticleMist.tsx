"use client";

import React, { useEffect, useRef, useState } from "react";

type AnimationConfig = {
  fadeInSpeed?: number;
  fadeOutSpeed?: number;
  movementSpeed?: number;
  maxLifeRange?: [number, number];
};

type StarFieldConfig = {
  numStars?: number;
  sizeRange?: [number, number];
  parallaxFactor?: number;
  colorPalette?: string[];
  colorWeights?: number[];
  animationConfig?: AnimationConfig;
};

type Star = {
  baseX: number;
  baseY: number;
  r: number;
  color: string;
  opacity: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  fadingIn: boolean;
};

const getWeightedRandomColor = (palette: string[], weights: number[]): string => {
  const sum = weights.reduce((a, b) => a + b, 0);
  const rand = Math.random() * sum;
  let acc = 0;
  for (let i = 0; i < palette.length; i++) {
    acc += weights[i];
    if (rand <= acc) return palette[i];
  }
  return palette[palette.length - 1];
};

const createStar = (
  width: number,
  height: number,
  sizeRange: [number, number],
  palette: string[],
  weights: number[],
  movementSpeed: number,
  maxLifeRange: [number, number]
): Star => ({
  baseX: Math.random() * width,
  baseY: Math.random() * height,
  r: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
  color: getWeightedRandomColor(palette, weights),
  opacity: 0,
  vx: (Math.random() - 0.5) * movementSpeed,
  vy: (Math.random() - 0.5) * movementSpeed,
  life: 0,
  maxLife: Math.random() * (maxLifeRange[1] - maxLifeRange[0]) + maxLifeRange[0],
  fadingIn: true,
});

const StarFieldBackground: React.FC<StarFieldConfig> = ({
  numStars = 200,
  sizeRange = [1, 3],
  parallaxFactor = 0.5,
  colorPalette = ["#ffffff"],
  colorWeights = [1],
  animationConfig = {},
}) => {
  const {
    fadeInSpeed = 0.01,
    fadeOutSpeed = 0.005,
    movementSpeed = 0.2,
    maxLifeRange = [200, 500],
  } = animationConfig;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const generateStars = (width: number, height: number) =>
      Array.from({ length: numStars }, () =>
        createStar(width, height, sizeRange, colorPalette, colorWeights, movementSpeed, maxLifeRange)
      );

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars.current = generateStars(canvas.width, canvas.height);
    };

    const updateAndDrawStars = () => {
      const width = canvas.width;
      const height = canvas.height;
      const scrollY = window.scrollY;

      ctx.clearRect(0, 0, width, height);

      stars.current.forEach((star, index) => {
        // Movement
        star.baseX += star.vx;
        star.baseY += star.vy;

        // Fade in/out
        if (star.fadingIn) {
          star.opacity += fadeInSpeed;
          if (star.opacity >= 1) {
            star.opacity = 1;
            star.fadingIn = false;
          }
        } else {
          if (star.life > star.maxLife) {
            star.opacity -= fadeOutSpeed;
          }
        }

        // Replace if dead
        if (star.opacity <= 0) {
          stars.current[index] = createStar(width, height, sizeRange, colorPalette, colorWeights, movementSpeed, maxLifeRange);
          return;
        }

        // Position with scroll
        const x = star.baseX + scrollY * parallaxFactor * 0.002 * (star.baseX - width / 2);
        const y = star.baseY + scrollY * parallaxFactor * 0.002 * (star.baseY - height / 2);

        // Draw
        ctx.beginPath();
        ctx.fillStyle = hexToRGBA(star.color, star.opacity);
        ctx.arc(x, y, star.r, 0, Math.PI * 2);
        ctx.fill();

        star.life++;
      });
    };

    const animate = () => {
      updateAndDrawStars();
      requestAnimationFrame(animate);
    };

    const hexToRGBA = (hex: string, alpha: number): string => {
      const bigint = parseInt(hex.replace("#", ""), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [
    mounted,
    numStars,
    sizeRange,
    parallaxFactor,
    colorPalette,
    colorWeights,
    fadeInSpeed,
    fadeOutSpeed,
    movementSpeed,
    maxLifeRange,
  ]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      }}
    />
  );
};

export default StarFieldBackground;
