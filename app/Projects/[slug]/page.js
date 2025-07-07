import { useRouter } from "next/router";
import ProjectTemplate from "../Components/ProjectTemplate";
import projectsData from '../../data/projects';

export async function getStaticPaths() {
  const paths = projectsData.map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const project = projectsData.find((p) => p.slug === params.slug);
  return { props: { project } };
}


export default function ProjectPage({ project }) {
  const router = useRouter();

  if (!project) return <div>Not found</div>;

  return <ProjectTemplate {...project} />;
}
