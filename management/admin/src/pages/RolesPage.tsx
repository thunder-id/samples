// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {RoleList} from '@thunderid/react';
import type {ReactElement} from 'react';
import {Link, useNavigate} from 'react-router';
import PlusIcon from '../components/icons/PlusIcon';

export default function RolesPage(): ReactElement {
  const navigate = useNavigate();

  return (
    <RoleList
      title="Roles"
      description="Sets of permissions you assign to users, groups, applications and agents."
      onSelect={(role) => void navigate(`/roles/${role.id}`)}
      actions={
        <Link to="/roles/new" className="admin-primary-link admin-primary-link--icon">
          <PlusIcon />
          Create role
        </Link>
      }
    />
  );
}
