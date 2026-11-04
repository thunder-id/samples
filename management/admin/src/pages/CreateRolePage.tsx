// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {RoleCreate} from '@thunderid/react';
import type {ReactElement} from 'react';
import {useNavigate} from 'react-router';
import BackLink from '../components/BackLink';

export default function CreateRolePage(): ReactElement {
  const navigate = useNavigate();

  return (
    <>
      <BackLink to="/roles" label="Roles" />
      <RoleCreate
        title="Create role"
        onCreated={(role) => void navigate(`/roles/${role.id}`, {replace: true})}
        onCancel={() => void navigate('/roles')}
      />
    </>
  );
}
