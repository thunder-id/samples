// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {GroupDetails} from '@thunderid/react';
import type {ReactElement} from 'react';
import {useNavigate, useParams} from 'react-router';
import BackLink from '../components/BackLink';

export default function GroupPage(): ReactElement {
  const navigate = useNavigate();
  const {id = ''} = useParams();

  return (
    <>
      <BackLink to="/groups" label="Groups" />
      {/* GroupDetails shows the group with its GroupMembers. Members are offered from the group's own organization unit. */}
      <GroupDetails
        key={id}
        groupId={id}
        editable
        deletable
        onDeleted={() => void navigate('/groups', {replace: true})}
      />
    </>
  );
}
