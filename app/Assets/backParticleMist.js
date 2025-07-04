"use client"
import React, { useState, useEffect } from 'react';
import ParticleBackground from 'react-particle-backgrounds'

const GradientTransition = function () {

  const settings = {
    canvas: {
      canvasFillSpace: true,
      useBouncyWalls: false
    },
    particle: {
      particleCount: 450,
      color: "#bbb",
      minSize: 1,
      maxSize: 3
    },
    velocity: {
      minSpeed: 0.1,
      maxSpeed: 0.4
    },
    opacity: {
      minOpacity: 0,
      maxOpacity: 0.7,
      opacityTransitionTime: 10000
    }
  }

  return (
    <ParticleBackground settings={settings} />
  )
}
export default GradientTransition;
