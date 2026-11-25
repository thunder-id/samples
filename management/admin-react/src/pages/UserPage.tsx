// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {UserDetails, SharingPolicies} from '@thunderid/react';
import type {ReactElement} from 'react';
import {useNavigate, useParams} from 'react-router';
import BackLink from '../components/BackLink';

export default function UserPage(): ReactElement {
  const navigate = useNavigate();
  const {id = ''} = useParams();

  return (
    <>
      <BackLink to="/users" label="Users" />
      {/*
        Editing, deleting and the suspend, unsuspend and unlock actions are off unless turned on. The account actions
        show only when the server configures their administration flows.
      */}
      <UserDetails
        key={id}
        userId={id}
        editable
        deletable
        lifecycleActions
        onDeleted={() => void navigate('/users', {replace: true})}
      />
      {/* Sharing policies decide which other organization units can see and use this user. */}
      <div className="admin-panel">
        <SharingPolicies key={`sharing-${id}`} resourceType="user" resourceId={id} editable />
      </div>
    </>
  );
}
