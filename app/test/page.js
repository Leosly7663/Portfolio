"use client";
import GradientTransition from "../Assets/backParticleMist";

export default function TestPage() {
  return (
    <div className="relative h-screen bg-black">
      <GradientTransition />
      <h1 className="absolute top-10 left-10 text-white text-3xl z-10">It Works!</h1>
    </div>
  );
}