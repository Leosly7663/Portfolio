const projectsData = [
  {
    slug: "This-Portfolio",
    title: "This Portfolio",
    date: "2025-06",
    description: "An interactive dashboard built with React and Chart.js for visualizing business metrics.",
    content: `
## Overview

This portfolio was built with a strong focus on **clarity** and **interactive design**.  
It features:

- ✅ Statically generated content
- 🎯 Reusable component architecture
- 📱 Responsive layouts

### Tech Highlights

- Built using **Next.js** and **Tailwind CSS**
- Hosted on **Vercel** with CI/CD integration
    `,
    tech: [
      {
        title: "Front-End",
        items: [
          { src: "/react-2.svg", alt: "React Icon" },
          { src: "/tailwind-css-2.svg", alt: "Tailwind Icon" }
        ]
      },
      {
        title: "Hosting",
        items: [
          { src: "/vercel_favicon.svg", alt: "Vercel Icon" }
        ]
      },
      {
        title: "CI CD",
        items: [
          { src: "/vercel_favicon.svg", alt: "Vercel Icon" }
        ]
      }
    ]
  },
  {
    slug: "Flask-Sentence-Embeddings-API",
    title: "Sentence Embeddings Generation Comparison API",
    date: "2025-07",
    description: "A lightweight Flask API that compares similarity scores between input text and PDFs using sentence-transformer embeddings.",
    content: `
## Overview

This RESTful API accepts:

- 🔤 Keyword queries
- 📄 PDF text content

It returns **semantic match percentages** using **sentence-transformer embeddings**.

### Deployment

- 🐍 Flask back end
- 🐳 Dockerized for deployment
- 🧪 Tested with various transformer models
    `,
    tech: [
      {
        title: "Back-End",
        items: [
          { src: "/python.svg", alt: "Python Icon" },
          { src: "/flask.svg", alt: "Flask Icon" },
          { src: "/docker.svg", alt: "Docker Icon" }
        ]
      }
    ]
  },
  {
    slug: "Weather-GC-App",
    title: "Weather GC App",
    date: "2024-12",
    description: "A government weather visualization dashboard built with Next.js and Tailwind.",
    content: `
## Overview

A responsive dashboard for **visualizing Environment Canada data**.

### Features

- 📡 Real-time weather info
- 🌤️ Multiple views per department
- 📦 Statically deployed via **Next.js**

> Built with performance and accessibility in mind.
    `,
    tech: [
      {
        title: "Front-End",
        items: [
          { src: "/next-js.svg", alt: "Next.js Icon" },
          { src: "/tailwind-css-2.svg", alt: "Tailwind Icon" }
        ]
      }
    ]
  },
  {
    slug: "tailwind-ui-kit",
    title: "Tailwind UI Kit",
    date: "2025-01",
    description: "A collection of reusable UI components styled with Tailwind CSS for rapid development.",
    content: `
## Purpose

Created to **speed up prototyping** and enforce a **consistent UI system**.

### Includes

- 📐 Button and form systems
- 📦 Cards, modals, tabs
- 🎨 Mobile-first responsive grid

### Principles

- Accessibility-first
- Clean Tailwind-based structure
- Developer-focused documentation
    `,
    tech: [
      {
        title: "Front-End",
        items: [
          { src: "/tailwind-css-2.svg", alt: "Tailwind Icon" }
        ]
      }
    ]
  }
];

export default projectsData;
