const projectsData = [
  {
  slug: "this-portfolio",
  title: "This Portfolio",
  date: "Jan 28, 2024",
  description: `
  ## This Portfolio – Developer Profile Website

  A statically optimized, fully responsive developer portfolio built with modern full-stack technologies including **Next.js**, **React**, and **TypeScript**, and styled using **Tailwind CSS**. The project is hosted on **Vercel** using a serverless architecture and continuous deployment via **GitHub Actions**.

  The site showcases key professional highlights and personal projects, integrating animation, responsive design, and clean UX/UI practices. Design prototypes were developed in **Figma**, with a strong emphasis on accessible content structure and performance optimization.

  ### 🔧 Key Features
  - Modular project architecture with dynamic routing  
  - Tailored UI/UX components built from scratch and styled via Tailwind  
  - Rich project highlights section with live previews and categorized tech stacks  
  - Custom background animation for visual impact  
  - Integrated resume download, social links, and direct contact options  

  This portfolio not only demonstrates core front-end and design skills, but also reflects strong experience in system integration, **DevOps** (via GitHub Actions), and component-driven development.`,
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
    slug: "ResumeScanner",
    title: "Sentence Embeddings Generation Comparison API",
    date: "2025-07",
     description: `
  ## Resume Scanner – AI-Powered PDF & Text Matcher

This project combines a lightweight **Flask API** with a sleek React front-end to compare resume content against job descriptions using **sentence-transformer embeddings**. It enables users to upload a resume, input a job posting, and receive detailed similarity scores, helping quantify alignment between qualifications and job requirements.

### 🔍 How It Works
- Users upload resumes in ".pdf", ".doc", or ".docx" format.
- The resume is parsed into plain text client-side using "pdf.js" or DOCX parsing.
- The job description is split into individual requirement sentences.
- Both texts are sent to a **Flask API**, which uses **SBERT (Sentence-BERT)** to embed and compare them.
- The API returns the best-matching sentence pairs along with similarity percentages.
- Matching results are rendered in a stylized UI with highlights and scores.

This project highlights both **natural language processing skills** and **full-stack integration**—bridging AI/ML tooling with production-ready user interfaces.`,
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
  ];

export default projectsData;
