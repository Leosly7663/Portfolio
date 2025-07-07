const projectsData = [
  {
    slug: "This-Portfolio",
    title: "This Portfolio",
    date: "2025-06",
    description: "An interactive dashboard built with React and Chart.js for visualizing business metrics.",
    content: `This portfolio was built with a strong focus on clarity and interactive design. It features statically generated content, responsive layouts, and reusable component architecture.`,
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
    content: `This RESTful API accepts keyword queries and PDF text content, processes embeddings using various models, and returns match percentages. Deployed via Docker.`,
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
    content: `Integrated data sources from Environment Canada and provided responsive UI views with performance in mind. Statically deployed to the cloud.`,
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
    content: `Built to speed up prototyping and to serve as a base layer for future projects. Focuses on accessibility, mobile-first design, and consistency.`,
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