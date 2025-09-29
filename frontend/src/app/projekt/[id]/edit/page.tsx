import { ProjectEditor } from '../../../../components/projects/ProjectEditor';

interface ProjectEditPageProps {
  params: {
    id: string;
  };
}

export default function ProjectEditPage({ params }: ProjectEditPageProps) {
  return <ProjectEditor projectId={params.id} />;
}
