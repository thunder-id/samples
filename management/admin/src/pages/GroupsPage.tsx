// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {GroupList} from '@thunderid/react';
import type {ReactElement} from 'react';
import {Link, useNavigate} from 'react-router';
import PlusIcon from '../components/icons/PlusIcon';

export default function GroupsPage(): ReactElement {
  const navigate = useNavigate();

  return (
    <GroupList
      title="Groups"
      description="Groups of users and agents, which can hold roles together."
      onSelect={(group) => void navigate(`/groups/${group.id}`)}
      actions={
        <Link to="/groups/new" className="admin-primary-link admin-primary-link--icon">
          <PlusIcon />
          Create group
        </Link>
      }
    />
  );
}
