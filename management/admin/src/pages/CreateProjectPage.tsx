// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ProjectCreate} from '@thunderid/react';
import type {ReactElement} from 'react';
import {useNavigate} from 'react-router';
import BackLink from '../components/BackLink';

export default function CreateProjectPage(): ReactElement {
  const navigate = useNavigate();

  return (
    <>
      <BackLink to="/projects" label="Projects" />
      <ProjectCreate
        title="Create project"
        onCreated={(project) => void navigate(`/projects/${project.id}`, {replace: true})}
        onCancel={() => void navigate('/projects')}
      />
    </>
  );
}
