// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ApplicationList, useThunderID} from '@thunderid/react';
import type {ReactElement} from 'react';
import {Link, useNavigate} from 'react-router';
import PlusIcon from '../components/icons/PlusIcon';

export default function ApplicationsPage(): ReactElement {
  const navigate = useNavigate();
  const {currentProject} = useThunderID();

  return (
    <ApplicationList
      title="Applications"
      description={
        currentProject
          ? `The applications in the ${currentProject.displayName} project, and the ones shared into it.`
          : 'The applications that sign users in through your ThunderID server.'
      }
      onSelect={(application) => void navigate(`/applications/${application.id}`)}
      actions={
        <Link to="/applications/new" className="admin-primary-link admin-primary-link--icon">
          <PlusIcon />
          Create application
        </Link>
      }
    />
  );
}
