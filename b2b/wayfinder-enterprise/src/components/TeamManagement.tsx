// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import { GroupCreate, GroupList, GroupMembers, RoleAssignments, UserCreate, UserList } from '@thunderid/nextjs';
import { useState } from 'react';
import Icon, { IconName } from './Icon';

const USER_FIELDS = [
  { name: 'username', required: true },
  { name: 'email', required: true, type: 'email' as const },
  { name: 'given_name', label: 'First name' },
  { name: 'family_name', label: 'Last name' },
  { name: 'password', required: true, type: 'password' as const },
];

const TABS = ['Users', 'Groups', 'Roles'] as const;

const TAB_ICONS: Record<(typeof TABS)[number], IconName> = { Users: 'users', Groups: 'group', Roles: 'shield' };

interface TeamManagementProps {
  adminRoleId: string;
  memberRoleId: string;
  ouId: string;
}

/**
 * The ThunderID admin components, scoped to the admin's company. Their users, groups and roles calls go
 * through the app's /api/admin routes, which pin each one to that company.
 */
export default function TeamManagement({ adminRoleId, memberRoleId, ouId }: TeamManagementProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Users');
  const [selectedGroupId, setSelectedGroupId] = useState<string>();
  // Remounting a form after a create clears it. The lists refresh by themselves.
  const [userFormKey, setUserFormKey] = useState(0);
  const [groupFormKey, setGroupFormKey] = useState(0);

  return (
    <div className="stack">
      <div className="tab-nav" role="group" aria-label="Team">
        {TABS.map((name) => (
          <button key={name} type="button" aria-pressed={tab === name} onClick={() => setTab(name)}>
            <Icon name={TAB_ICONS[name]} size={16} />
            {name}
          </button>
        ))}
      </div>

      {tab === 'Users' && (
        <div className="two-column">
          <section className="panel">
            <UserList filter={`ouId eq "${ouId}"`} title="People in your company" />
          </section>
          <section className="panel">
            <UserCreate
              key={userFormKey}
              ouId={ouId}
              onCreated={() => setUserFormKey((key) => key + 1)}
              fields={USER_FIELDS}
              title="Add a user"
              description="New users can sign in with a password. Give them a role on the Roles tab."
            />
          </section>
        </div>
      )}

      {tab === 'Groups' && (
        <div className="two-column">
          <section className="panel">
            <GroupList title="Groups" onSelect={(group) => setSelectedGroupId(group.id)} selectedGroupId={selectedGroupId} />
            {selectedGroupId && <GroupMembers groupId={selectedGroupId} ouId={ouId} editable />}
          </section>
          <section className="panel">
            <GroupCreate
              key={groupFormKey}
              ouId={ouId}
              title="Create a group"
              onCreated={(group) => {
                setSelectedGroupId(group.id);
                setGroupFormKey((key) => key + 1);
              }}
            />
          </section>
        </div>
      )}

      {tab === 'Roles' && (
        <div className="stack">
          <section className="panel">
            <RoleAssignments
              roleId={adminRoleId}
              ouId={ouId}
              editable
              title="Wayfinder Admin"
              description="Manage the travel policy, the team and enterprise SSO."
            />
          </section>
          <section className="panel">
            <RoleAssignments
              roleId={memberRoleId}
              ouId={ouId}
              editable
              title="Wayfinder Member"
              description="Book flights within the travel policy."
            />
          </section>
        </div>
      )}
    </div>
  );
}
