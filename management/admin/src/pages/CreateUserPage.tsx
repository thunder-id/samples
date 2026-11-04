// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {UserCreate} from '@thunderid/react';
import type {ReactElement} from 'react';
import {useNavigate} from 'react-router';
import BackLink from '../components/BackLink';

export default function CreateUserPage(): ReactElement {
  const navigate = useNavigate();

  return (
    <>
      <BackLink to="/users" label="Users" />
      {/* Created in the signed-in administrator's organization unit. */}
      <UserCreate
        title="Create user"
        onCreated={(user) => void navigate(`/users/${user.id}`, {replace: true})}
        onCancel={() => void navigate('/users')}
      />
    </>
  );
}
