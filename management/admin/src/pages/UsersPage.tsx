// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {UserList} from '@thunderid/react';
import type {ReactElement} from 'react';
import {Link, useNavigate} from 'react-router';
import PlusIcon from '../components/icons/PlusIcon';

export default function UsersPage(): ReactElement {
  const navigate = useNavigate();

  return (
    <UserList
      title="Users"
      description="The people who can sign in to your ThunderID server."
      searchable
      onSelect={(user) => void navigate(`/users/${user.id}`)}
      actions={
        <Link to="/users/new" className="admin-primary-link admin-primary-link--icon">
          <PlusIcon />
          Create user
        </Link>
      }
    />
  );
}
