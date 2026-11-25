// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {GroupCreate} from '@thunderid/react';
import type {ReactElement} from 'react';
import {useNavigate} from 'react-router';
import BackLink from '../components/BackLink';

export default function CreateGroupPage(): ReactElement {
  const navigate = useNavigate();

  return (
    <>
      <BackLink to="/groups" label="Groups" />
      <GroupCreate
        title="Create group"
        onCreated={(group) => void navigate(`/groups/${group.id}`, {replace: true})}
        onCancel={() => void navigate('/groups')}
      />
    </>
  );
}
