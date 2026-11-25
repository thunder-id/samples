// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import BookingsDashboard from '@/components/BookingsDashboard';
import PageHeader from '@/components/PageHeader';
import { getSessionUser, hasScope } from '@/lib/auth';

export default async function BookingsPage() {
  const user = await getSessionUser();

  return (
    <>
      <PageHeader
        eyebrow="Flight booking"
        title="Book within your travel policy"
        description="Search fares and book. Each flight shows how it fits your company's travel policy."
      />
      <BookingsDashboard canManageBookings={user ? hasScope(user, 'booking:manage') : false} />
    </>
  );
}
