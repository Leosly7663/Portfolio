"use client";

import React, { useEffect, useRef } from "react";

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
  return palette[palette.length - 1]; // fallback
};

const StarFieldBackground: React.FC<StarFieldConfig> = ({
  numStars = 200,
  sizeRange = [1, 3],
  parallaxFactor = 0.5,
  colorPalette = ["#ffffff"],
  colorWeights = [1],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollY = useRef<number>(window.scrollY);
  const stars = useRef<Star[]>([]);
  const canvasSize = useRef<{ width: number; height: number }>({
  width: window.innerWidth, // ❌ SSR will crash here
  height: window.innerHeight,
});

  const generateStars = (width: number, height: number) => {
    return Array.from({ length: numStars }, () => ({
      baseX: Math.random() * width,
      baseY: Math.random() * height,
      r: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
      color: getWeightedRandomColor(colorPalette, colorWeights),
    }));
  };

  useEffect(() => {
    if (typeof window === "undefined") return null;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    canvasSize.current = { width, height };
    stars.current = generateStars(width, height);

    const drawStars = () => {
      ctx.clearRect(0, 0, width, height);
      const scrollOffset = window.scrollY;
      scrollY.current = scrollOffset;

      for (const star of stars.current) {
        const x = star.baseX + scrollOffset * parallaxFactor * 0.002 * (star.baseX - width / 2);
        const y = star.baseY + scrollOffset * parallaxFactor * 0.002 * (star.baseY - height / 2);

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

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      canvasSize.current = { width, height };
      stars.current = generateStars(width, height);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", drawStars, { passive: true });

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", drawStars);
    };
  }, [numStars, sizeRange, parallaxFactor, colorPalette, colorWeights]);

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
