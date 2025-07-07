import ProjectTemplate from "../../Components/ProjectTemplate";
import projectsData from '../../Data/Projects';

export async function generateStaticParams() {
  return projectsData.map((p) => ({
    slug: p.slug,
  }));
}

export default function ProjectPage({ params }) {
    
  const project = projectsData.find((p) => p.slug === params.slug);

  if (!project) return <div>Not found</div>;

  return <ProjectTemplate {...project} />;
}


