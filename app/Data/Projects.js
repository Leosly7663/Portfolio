const projectsData = [
  {
  slug: "this-portfolio",
  title: "This Portfolio",
  date: "Jan 28, 2024",
  description: `
  ## A 
  statically optimized, fully responsive portfolio site built with modern front-end tooling and deployed in a serverless architecture on Vercel.`,
  content: `
## Overview

This portfolio was built with a strong emphasis on **clarity**, **modularity**, and **developer experience**. It functions both as a professional showcase and as a lightweight playground for experimenting with modern web practices.

Key features include:

- ⚡ **Static Site Generation (SSG)** via Next.js for optimal performance and SEO
- 🎨 A **component-first architecture** for reusability and maintainability
- 📱 **Mobile-first responsive design** using Tailwind's utility classes
- 🔁 Continuous deployment integrated with GitHub for seamless updates

---

## Technical Architecture

The site is powered by the **Next.js App Router**, leveraging its support for file-based routing and metadata handling. All pages are statically generated at build time, ensuring instant load speeds with CDN-level caching through Vercel.

**Tailwind CSS** provides a performant, design-system-like layer for styling. All UI components are modular and built from the ground up, avoiding external UI libraries to keep the design minimal and intentional.

CI/CD is handled entirely by **Vercel**, triggered via GitHub pushes to the "main" or "working" branch. Vercel handles the build, cache invalidation, and atomic deployments automatically for production and testing environments.

---

## Deployment Model

- The site is **deployed serverlessly**, with no backend infrastructure.
- Static assets and pre-rendered HTML are distributed globally via Vercel’s edge network.
- This results in <50ms TTFB globally and zero-maintenance scaling.

---

## Developer Experience

- 🧪 Local development uses "vercel dev" for parity with production
- 🧩 Modular "data/.ts" files allow dynamic page generation without a CMS
- 🛠️ Strict TypeScript and ESLint configs ensure clean, safe code

---

## Future Improvements

- Add structured content authoring via MDX
- Add a dedicated pre-release environment for user testing
- Integrate a lightweight CMS (e.g., Contentlayer or Sanity) for easier project additions
- Support dark mode and accessibility refinements

---
  `,
  tech: [
    {
      title: "Framework & Tooling",
      items: [
        { src: "/next-js.svg", alt: "Next.js" },
        { src: "/react-2.svg", alt: "React" },
        { src: "/Typescript-logo.png", alt: "TypeScript" }
      ]
    },
    {
      title: "Styling & UI/UX",
      items: [
        { src: "/tailwind-css-2.svg", alt: "Tailwind CSS" },
        { src: "/Figma-logo.png", alt: "Figma" }
      ]
    },
    {
      title: "Deployment & Infrastructure",
      items: [
        { src: "/vercel_favicon.svg", alt: "Vercel" },
        { src: "/nodejs-logo.png", alt: "Node" }
      ]
    },
    {
      title: "CI/CD & DevOps",
      items: [
        { src: "/github-actions-logo.png", alt: "GitHub Actions (via Vercel)" }
      ]
    }
  ]
}
,
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
        title: "Embedding Logic",
        items: [
          { src: "/python-logo.png", alt: "Python Icon" },
          { src: "/SBERT.png", alt: "Sentence Transformers Icon" },
        ]
      },
      {
        title: "Hosting & API Access",
        items: [
          { src: "/flask.svg", alt: "Flask Icon" },
          { src: "/Cloudflare-icon.png", alt: "Cloudflare Icon" },
          { src: "/docker-icon.png", alt: "Docker Icon" }
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
