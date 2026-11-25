// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ProjectList, useThunderID} from '@thunderid/react';
import type {ReactElement} from 'react';
import {Link, useNavigate} from 'react-router';
import PlusIcon from '../components/icons/PlusIcon';

export default function ProjectsPage(): ReactElement {
  const navigate = useNavigate();
  const {currentProject} = useThunderID();

  return (
    <ProjectList
      title="Projects"
      description="Projects group the applications and agents that belong together. Choose the current one in the sidebar."
      selectedProjectId={currentProject?.id}
      onSelect={(project) => void navigate(`/projects/${project.id}`)}
      actions={
        <Link to="/projects/new" className="admin-primary-link admin-primary-link--icon">
          <PlusIcon />
          Create project
        </Link>
      }
    />
  );
}
