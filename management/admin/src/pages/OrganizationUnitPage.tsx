// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {OrganizationUnitDetails} from '@thunderid/react';
import type {ReactElement} from 'react';
import {Link, useNavigate, useParams} from 'react-router';
import BackLink from '../components/BackLink';
import PlusIcon from '../components/icons/PlusIcon';

export default function OrganizationUnitPage(): ReactElement {
  const navigate = useNavigate();
  const {id = ''} = useParams();
  const parent: string = encodeURIComponent(id);

  return (
    <>
      <BackLink to="/organization-units" label="Organization units" />
      {/* The unit's child units, users, groups and roles are shown read only. Choosing a child unit opens it. */}
      <OrganizationUnitDetails
        key={id}
        organizationUnitId={id}
        editable
        deletable
        onDeleted={() => void navigate('/organization-units', {replace: true})}
        onSelectChild={(unit) => void navigate(`/organization-units/${unit.id}`)}
        actions={
          <div className="admin-actions">
            <Link to={`/organization-units?parent=${parent}`} className="admin-btn">
              All child units
            </Link>
            <Link
              to={`/organization-units/new?parent=${parent}`}
              className="admin-primary-link admin-primary-link--icon"
            >
              <PlusIcon />
              Create child unit
            </Link>
          </div>
        }
      />
    </>
  );
}
