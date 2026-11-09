// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {OrganizationUnitCreate} from '@thunderid/react';
import type {ReactElement} from 'react';
import {useNavigate, useSearchParams} from 'react-router';
import BackLink from '../components/BackLink';

// Creates a root organization unit, or with `?parent=<id>` a child of that unit. Without a parent, the form offers
// one to choose, which can be left empty for a new root.
export default function CreateOrganizationUnitPage(): ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentId: string | undefined = searchParams.get('parent') ?? undefined;
  const backTo: string = parentId ? `/organization-units/${parentId}` : '/organization-units';

  return (
    <>
      <BackLink to={backTo} label={parentId ? 'Organization unit' : 'Organization units'} />
      <OrganizationUnitCreate
        title={parentId ? 'Create child unit' : 'Create organization unit'}
        parentId={parentId}
        onCreated={(unit) => void navigate(`/organization-units/${unit.id}`, {replace: true})}
        onCancel={() => void navigate(backTo)}
      />
    </>
  );
}
