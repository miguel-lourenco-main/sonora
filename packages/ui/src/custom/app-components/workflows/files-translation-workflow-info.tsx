'use client';

import { useState } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from '../../shadcn/breadcrumbs';

const tabs = [
  {
    label: 'Api',
    value: 'api',
  },
  {
    label: 'Documentation',
    value: 'documentation',
  },
  {
    label: 'Examples',
    value: 'examples',
  },
];

export default function WorkflowInfoPage({
  workflowId,
}: {
  workflowId: string;
}) {
  
  const [files, setFiles] = useState<File[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('api');

  return (
    <div>
      <div className="mx-auto flex h-[calc(100vh-12rem)] w-full flex-col py-14 pb-6 xl:w-[1280px]">
        <WorkflowBreadCrumbs workflowId={workflowId} />

        <div className='flex flex-col w-full h-fit items-start justify-center mt-6'>
          <p className="text-3xl font-bold mb-2 text-foreground">Workflow {workflowId}</p>

          <div className=' mt-6 ml-4'>
            <p className="mb-2 text-foreground">
              The File Translation AI Workflow is an advanced tool that seamlessly
              translates documents across multiple languages and formats. It
              utilizes cutting-edge machine learning to preserve context, tone,
              and formatting.
            </p>

            <p className="mb-2 text-foreground">
              This versatile workflow supports various file types, including PDFs,
              Word documents, and spreadsheets. It excels in maintaining accuracy
              for industry-specific terminology.
            </p>

            <p className="mb-2 text-foreground">
              With its user-friendly interface and rapid processing, the workflow
              streamlines translation workflows, enhancing global communication
              and collaboration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowBreadCrumbs({ workflowId }: { workflowId: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/workflows">Workflows</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Workflow {workflowId}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
