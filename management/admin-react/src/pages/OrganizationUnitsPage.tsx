// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {OrganizationUnitList} from '@thunderid/react';
import type {ReactElement} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router';
import BackLink from '../components/BackLink';
import PlusIcon from '../components/icons/PlusIcon';

// Lists the root organization units, or with `?parent=<id>` the child units of one unit.
export default function OrganizationUnitsPage(): ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const parentId: string | undefined = searchParams.get('parent') ?? undefined;
  const createTo: string = parentId
    ? `/organization-units/new?parent=${encodeURIComponent(parentId)}`
    : '/organization-units/new';

  return (
    <>
      {parentId ? <BackLink to={`/organization-units/${parentId}`} label="Organization unit" /> : null}
      <OrganizationUnitList
        key={parentId ?? 'roots'}
        parentId={parentId}
        title={parentId ? 'Child units' : 'Organization units'}
        description={
          parentId
            ? 'The organization units directly under this one.'
            : 'The top-level organization units on your ThunderID server. Open one to see what it holds.'
        }
        onSelect={(unit) => void navigate(`/organization-units/${unit.id}`)}
        actions={
          <Link to={createTo} className="admin-primary-link admin-primary-link--icon">
            <PlusIcon />
            {parentId ? 'Create child unit' : 'Create organization unit'}
          </Link>
        }
      />
    </>
  );
}
