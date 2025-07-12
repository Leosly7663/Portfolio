"use client";

import React, { useEffect, useRef, useState } from "react";

type StarFieldConfig = {
  numStars?: number;
  sizeRange?: [number, number];
  parallaxFactor?: number;
  colorPalette?: string[];
  colorWeights?: number[];
};

type Star = {
  baseX: number;
  baseY: number;
  r: number;
  color: string;
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

const StarFieldBackground: React.FC<StarFieldConfig> = ({
  numStars = 200,
  sizeRange = [1, 3],
  parallaxFactor = 0.5,
  colorPalette = ["#ffffff"],
  colorWeights = [1],
}) => {
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

    const generateStars = (width: number, height: number): Star[] =>
      Array.from({ length: numStars }, () => ({
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        r: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
        color: getWeightedRandomColor(colorPalette, colorWeights),
      }));

    const resizeCanvas = () => {
      const width = (canvas.width = window.innerWidth);
      const height = (canvas.height = window.innerHeight);
      stars.current = generateStars(width, height);
    };

    const drawStars = () => {
      if (!canvas || !ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const scrollY = window.scrollY;

      ctx.clearRect(0, 0, width, height);

      if (stars.current.length === 0) {
        console.warn("No stars to draw");
        return;
      }

      for (const star of stars.current) {
        const x = star.baseX + scrollY * parallaxFactor * 0.002 * (star.baseX - width / 2);
        const y = star.baseY + scrollY * parallaxFactor * 0.002 * (star.baseY - height / 2);

        ctx.beginPath();
        ctx.fillStyle = star.color;
        ctx.arc(x, y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      drawStars();
      requestAnimationFrame(animate);
    };

    resizeCanvas(); // on first mount
    animate();      // begin animation

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", drawStars, { passive: true });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", drawStars);
    };
  }, [mounted, numStars, sizeRange, parallaxFactor, colorPalette, colorWeights]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      width={0}
      height={0}
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
