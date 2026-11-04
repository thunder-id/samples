// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ProjectDetails} from '@thunderid/react';
import type {ReactElement} from 'react';
import {useNavigate, useParams} from 'react-router';
import BackLink from '../components/BackLink';

export default function ProjectPage(): ReactElement {
  const navigate = useNavigate();
  const {id = ''} = useParams();

  return (
    <>
      <BackLink to="/projects" label="Projects" />
      {/* Deleting the current project clears it from the sidebar. Renaming it updates the sidebar too. */}
      <ProjectDetails
        key={id}
        projectId={id}
        editable
        deletable
        onDeleted={() => void navigate('/projects', {replace: true})}
      />
    </>
  );
}
