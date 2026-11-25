// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import PageHeader from '@/components/PageHeader';
import TeamManagement from '@/components/TeamManagement';
import config from '@/lib/config';
import requireAdmin from '@/lib/requireAdmin';

export default async function TeamPage() {
  const user = await requireAdmin();

  return (
    <>
      <PageHeader
        eyebrow="Team and roles"
        title="Manage who can use Wayfinder"
        description="Add people to your company, organize them into groups, and choose who administers Wayfinder."
      />
      <TeamManagement ouId={user.ouId} adminRoleId={config.adminRoleId} memberRoleId={config.memberRoleId} />
    </>
  );
}
