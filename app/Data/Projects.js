const projectsData = [
  {
    slug: "this-portfolio",
    title: "This Portfolio",
    date: "Jan 28, 2024",
    demo: "/",
    galleryDescription: `
This portfolio is designed to feel personal first and polished second.

- A cleaner reading flow for projects, experience, and contact details
- Custom sections that are easy to grow over time
- A visual system focused on clarity, spacing, and calmer motion
    `,
    caption:
      "A modular portfolio refresh focused on readability, personality, and a more structured gallery experience.",
    previewCaption:
      "The live site keeps the interaction simple while the new gallery layout gives each project its own dedicated frame.",
    media: [
      {
        type: "panel",
        gradient: "from-slate-900 via-slate-800 to-sky-800",
        eyebrow: "Gallery Concept",
        title: "A portfolio that feels more editorial.",
        description:
          "This refresh leans into lighter surfaces, stronger spacing, and project cards that separate visuals from supporting details.",
        details: [
          "Responsive card system for better scanning",
          "Cleaner hierarchy across hero, about, and projects",
        ],
        tags: ["Next.js", "React", "Tailwind CSS"],
        caption:
          "The gallery panels act like built-in preview boards, giving each project a more organized visual home.",
      },
      {
        type: "panel",
        gradient: "from-sky-700 via-cyan-700 to-teal-600",
        eyebrow: "Content Strategy",
        title: "Structured enough to grow with new work.",
        description:
          "Each project uses the same data-driven logic, which makes it easier to add future media, links, and technology highlights without redesigning the section.",
        details: [
          "Reusable section patterns",
          "Easy to extend with more projects and media types",
        ],
        tags: ["Reusable UI", "Content-driven", "Scalable"],
        caption:
          "The same project mapping logic now powers a more polished, easier-to-browse layout.",
      },
    ],
    description: `
## This Portfolio - Developer Profile Website

A statically optimized, fully responsive developer portfolio built with modern full-stack technologies including **Next.js**, **React**, and **TypeScript**, and styled using **Tailwind CSS**. The project is hosted on **Vercel** using a serverless architecture and continuous deployment via **GitHub Actions**.

The site showcases key professional highlights and personal projects, integrating animation, responsive design, and clean UX/UI practices. Design prototypes were developed in **Figma**, with a strong emphasis on accessible content structure and performance optimization.

### Key Features
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

- Static Site Generation (SSG) via Next.js for optimal performance and SEO
- A component-first architecture for reusability and maintainability
- Mobile-first responsive design using Tailwind's utility classes
- Continuous deployment integrated with GitHub for seamless updates

---

## Technical Architecture

The site is powered by the **Next.js App Router**, leveraging its support for file-based routing and metadata handling. All pages are statically generated at build time, ensuring instant load speeds with CDN-level caching through Vercel.

**Tailwind CSS** provides a performant, design-system-like layer for styling. All UI components are modular and built from the ground up, avoiding external UI libraries to keep the design minimal and intentional.

CI/CD is handled entirely by **Vercel**, triggered via GitHub pushes to the "main" or "working" branch. Vercel handles the build, cache invalidation, and atomic deployments automatically for production and testing environments.

---

## Deployment Model

- The site is **deployed serverlessly**, with no backend infrastructure.
- Static assets and pre-rendered HTML are distributed globally via Vercel's edge network.
- This results in <50ms TTFB globally and zero-maintenance scaling.

---

## Developer Experience

- Local development uses "vercel dev" for parity with production
- Modular data files allow dynamic page generation without a CMS
- Strict TypeScript and ESLint configs ensure clean, safe code

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
          { src: "/Typescript-logo.png", alt: "TypeScript" },
        ],
      },
      {
        title: "Styling & UI/UX",
        items: [
          { src: "/tailwind-css-2.svg", alt: "Tailwind CSS" },
          { src: "/figma-logo.png", alt: "Figma" },
        ],
      },
      {
        title: "Deployment & Infrastructure",
        items: [
          { src: "/Vercel_favicon.svg", alt: "Vercel" },
          { src: "/nodejs-logo.png", alt: "Node.js" },
          { src: "/github-actions-logo.png", alt: "GitHub Actions" },
        ],
      },
    ],
  },
  {
    slug: "ResumeScanner",
    title: "Sentence Embeddings Generation Comparison API",
    demo: "/ResumeScanner",
    livePreview: "/ResumeScanner",
    date: "2025-07",
    galleryDescription: `
This project compares resumes against job descriptions in a way that feels quick to interpret instead of overwhelming.

- Upload a resume and paste a job posting into a simple interface
- Break requirements into smaller comparison points
- Return clearer matching feedback powered by sentence embeddings
    `,
    caption:
      "An AI-assisted workflow that turns resume matching into something visual and easier to understand.",
    previewCaption:
      "The embedded preview lets the project interface sit directly inside the gallery card, which keeps the layout closer to your sketch.",
    media: [
      {
        type: "panel",
        gradient: "from-emerald-700 via-teal-700 to-slate-800",
        eyebrow: "User Flow",
        title: "Upload, compare, and read the result quickly.",
        description:
          "The UI is designed to move users from raw documents to a clear comparison view without making the AI layer feel too heavy or abstract.",
        details: [
          "Client-side parsing for resume files",
          "Readable score output tied to individual requirements",
        ],
        tags: ["Flask", "SBERT", "React"],
        caption:
          "This gallery view captures the product story even before someone opens the live project.",
      },
      {
        type: "panel",
        gradient: "from-slate-900 via-indigo-800 to-sky-700",
        eyebrow: "Model Layer",
        title: "Sentence embeddings under the hood.",
        description:
          "The matching engine uses semantic similarity instead of keyword counts, which helps the output feel more useful for real resumes and real postings.",
        details: [
          "Requirement-by-requirement similarity scoring",
          "Built to bridge NLP tooling with a front-end experience",
        ],
        tags: ["Python", "Embeddings", "API"],
        caption:
          "The second panel highlights the structure behind the comparison engine and its production-ready presentation.",
      },
    ],
    description: `
## Resume Scanner - AI-Powered PDF & Text Matcher

This project combines a lightweight **Flask API** with a sleek React front-end to compare resume content against job descriptions using **sentence-transformer embeddings**. It enables users to upload a resume, input a job posting, and receive detailed similarity scores, helping quantify alignment between qualifications and job requirements.

### How It Works
- Users upload resumes in ".pdf", ".doc", or ".docx" format.
- The resume is parsed into plain text client-side using "pdf.js" or DOCX parsing.
- The job description is split into individual requirement sentences.
- Both texts are sent to a **Flask API**, which uses **SBERT (Sentence-BERT)** to embed and compare them.
- The API returns the best-matching sentence pairs along with similarity percentages.
- Matching results are rendered in a stylized UI with highlights and scores.

This project highlights both **natural language processing skills** and **full-stack integration**, bridging AI and production-ready user interfaces.`,
    content: `
## Overview

This RESTful API accepts:

- Keyword queries
- PDF text content

It returns **semantic match percentages** using **sentence-transformer embeddings**.

### Deployment

- Flask back end
- Dockerized for deployment
- Tested with various transformer models
    `,
    tech: [
      {
        title: "Embedding Logic",
        items: [
          { src: "/python-logo.png", alt: "Python" },
          { src: "/SBERT.png", alt: "Sentence Transformers" },
        ],
      },
      {
        title: "Hosting & API Access",
        items: [
          { src: "/flask.svg", alt: "Flask" },
          { src: "/Cloudflare-icon.png", alt: "Cloudflare" },
          { src: "/docker-Icon.png", alt: "Docker" },
        ],
      },
    ],
  },
  {
    slug: "HybridETFTrackerAI",
    title: "Hybrid ETF Portfolio Tracker & Local AI Commentary Writer",
    demo: "/ETFTracker",
    livePreview: "/ETFTracker",
    date: "2025-08",
    galleryDescription: `
This project blends a live ETF dashboard with AI-generated commentary to make portfolio updates feel more organized and useful.

- Live bundle performance views with spot and managed portfolio metrics
- A documented system architecture connecting Next.js, Supabase, and the worker layer
- Quant visuals like volatility surfaces and trade metrics for deeper research workflows
    `,
    caption:
      "A finance-focused product that connects live tracking, structured data, and AI commentary in one flow.",
    previewCaption:
      "The preview window lets the live tracker sit inside the project card while the right panel keeps the explanation compact.",
    media: [
      {
        type: "image",
        src: "/etf-project/performance-metrics.png",
        alt: "ETF bundle performance table showing managed portfolio metrics",
        fit: "contain",
        backgroundClassName: "bg-white",
        caption:
          "Bundle-level performance tables show spot positions, daily movement, and all-time profit in a format that stays readable even with dense portfolio data.",
      },
      {
        type: "image",
        src: "/etf-project/trade-metrics.png",
        alt: "Live trade metrics dashboard with websocket-updated sparkline cards",
        fit: "contain",
        backgroundClassName: "bg-white",
        caption:
          "The live performance screen tracks short-window price movement through websocket-fed cards and a debug table for fast monitoring.",
      },
      {
        type: "image",
        src: "/etf-project/system-architecture.png",
        alt: "Technical system architecture diagram for the ETF tracker pipeline",
        fit: "contain",
        backgroundClassName: "bg-white",
        caption:
          "The architecture diagram maps how the app connects the React front end, Supabase data layer, market feeds, and the worker logic for managed actions.",
      },
      {
        type: "image",
        src: "/etf-project/volatility-surface.png",
        alt: "Implied volatility surface generated for an individual asset in the ETF workflow",
        fit: "contain",
        backgroundClassName: "bg-white",
        caption:
          "Research views like the volatility surface extend the project beyond simple tracking into options-aware analysis and deeper quantitative tooling.",
      },
    ],
    description: `
## Hybrid ETF Portfolio Tracker & Local AI Commentary Writer

This project merges a **public ETF tracking dashboard** with a **private local AI system** to deliver professional-grade investment analysis and commentary.
It showcases skills in **full-stack development**, **quantitative finance analytics**, and **local AI orchestration**.

### How It Works
- The **Vercel-hosted Next.js frontend** displays ETF bundle performance, asset allocations, and AI-generated commentary.
- A **cloud database** stores public-facing ETF data and AI reports, ensuring always-on availability.
- A **local lab environment** is the master source for ETF data and AI-generated insights.
- **Market data APIs** feed live or daily data into the local database.
- A **local AI runtime** generates investor-style reports using quantized models.
- A **sync script** pushes fresh data and commentary to the cloud layer for public display.
- **Cloudflare Tunnel** enables secure remote API and DB access without exposing the home network.

This hybrid design demonstrates **real-time financial analytics** combined with **AI-generated insights**, making it relevant for both **quant finance** and **AI/ML applications**.
  `,
    content: `
## Overview

This system consists of two main components:

- **Always-On Public Side**:
  Hosted on Vercel, powered by Next.js, Tailwind CSS, and cloud-backed storage.
  Displays ETF bundle data, allocation charts, and AI-generated commentary.

- **On-Demand Local AI Side**:
  Runs locally for heavy compute tasks, such as generating portfolio commentary or cover letters.
  Uses local runtimes to generate reports and analysis.

### Deployment

- **Frontend**: Vercel-hosted Next.js app with Tailwind CSS
- **Cloud Layer**: Public data storage and synced reports
- **Local DB**: Master data source for calculations and reporting
- **AI Runtime**: Local inference for commentary generation
- **Networking**: Cloudflare Tunnel for secure remote API access
- **Data Sources**: Market data providers for pricing and portfolio updates

### Visual Layers Added To The Project

- **Performance Metrics**: tabular spot and managed views for bundle-level P/L, daily changes, and historical position context
- **Live Trade Metrics**: sparkline cards and short-window performance reads for tracked assets in motion
- **System Architecture Diagram**: a mapped view of the front end, Supabase storage, worker jobs, and managed trigger flow
- **Volatility Surface Research**: an options-oriented analysis layer that pushes the project further into quant tooling
  `,
    images: [
      {
        src: "/etf-project/performance-metrics.png",
        alt: "ETF bundle performance metrics screenshot",
        fit: "contain",
        caption:
          "Managed bundle breakdown with ticker-level quantity, open price, live last price, daily change, and all-time profit metrics.",
      },
      {
        src: "/etf-project/trade-metrics.png",
        alt: "ETF live trade metrics screenshot",
        fit: "contain",
        caption:
          "Live performance dashboard using compact sparkline cards and interval-based movement reads for fast monitoring.",
      },
      {
        src: "/etf-project/system-architecture.png",
        alt: "ETF system architecture diagram",
        fit: "contain",
        caption:
          "High-level architecture showing the relationship between the App Router UI, Supabase, market data layers, and the execution worker.",
      },
      {
        src: "/etf-project/volatility-surface.png",
        alt: "ETF volatility surface analysis screenshot",
        fit: "contain",
        caption:
          "An implied volatility surface view for individual assets, representing the options-analysis direction of the project.",
      },
    ],
    tech: [
      {
        title: "Frontend & Presentation",
        items: [
          { src: "/next-js.svg", alt: "Next.js" },
          { src: "/tailwind-css-2.svg", alt: "Tailwind CSS" },
          { src: "/Vercel_favicon.svg", alt: "Vercel" },
        ],
      },
      {
        title: "Data & Delivery",
        items: [
          { src: "/python-logo.png", alt: "Python" },
          { src: "/Cloudflare-icon.png", alt: "Cloudflare" },
          { src: "/nodejs-logo.png", alt: "Node.js" },
        ],
      },
    ],
  },
];

export default projectsData;
