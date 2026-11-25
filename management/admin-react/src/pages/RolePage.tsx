// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {RoleDetails, SharingPolicies} from '@thunderid/react';
import type {ReactElement} from 'react';
import {useNavigate, useParams} from 'react-router';
import BackLink from '../components/BackLink';

export default function RolePage(): ReactElement {
  const navigate = useNavigate();
  const {id = ''} = useParams();

  return (
    <>
      <BackLink to="/roles" label="Roles" />
      {/*
        RoleDetails shows the role with its RolePermissions and RoleAssignments. With `editable`, permissions can be
        added and removed, and the role assigned and taken away. Read-only roles are never editable or deletable.
      */}
      <RoleDetails key={id} roleId={id} editable deletable onDeleted={() => void navigate('/roles', {replace: true})} />
      {/* Sharing policies decide which other organization units can see and assign this role. */}
      <div className="admin-panel">
        <SharingPolicies key={`sharing-${id}`} resourceType="role" resourceId={id} editable />
      </div>
    </>
  );
}
