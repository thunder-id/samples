// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import PageHeader from '@/components/PageHeader';
import PolicyEditor from '@/components/PolicyEditor';
import requireAdmin from '@/lib/requireAdmin';

export default async function PolicyPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        eyebrow="Travel policy"
        title="Set what your team can book"
        description="These limits apply to every member of your company. Admins can book outside them."
      />
      <PolicyEditor />
    </>
  );
}
