// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ApplicationDetails, SharingPolicies} from '@thunderid/react';
import type {ReactElement} from 'react';
import {useNavigate, useParams} from 'react-router';
import BackLink from '../components/BackLink';

export default function ApplicationPage(): ReactElement {
  const navigate = useNavigate();
  const {id = ''} = useParams();

  return (
    <>
      <BackLink to="/applications" label="Applications" />
      <ApplicationDetails
        key={id}
        applicationId={id}
        editable
        deletable
        secretRegenerable
        lifecycleActions
        onDeleted={() => void navigate('/applications', {replace: true})}
      />
      {/* Sharing policies decide which other organization units can see and use this application. */}
      <div className="admin-panel">
        <SharingPolicies key={`sharing-${id}`} resourceType="application" resourceId={id} editable />
      </div>
    </>
  );
}
