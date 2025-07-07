import { useRouter } from "next/router";
import projects from "../Data/Projects";
import ProjectTemplate from "../Components/ProjectTemplate";

export async function getStaticPaths() {
  const paths = projects.map((project) => ({
    params: { slug: project.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const project = projects.find((p) => p.slug === params.slug);

  return {
    props: {
      project,
    },
  };
}

export default function ProjectPage({ project }) {
  const router = useRouter();

  if (!project) return <div>Not found</div>;

  return <ProjectTemplate {...project} />;
}
