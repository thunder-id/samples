// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ApplicationCreate} from '@thunderid/react';
import type {ReactElement} from 'react';
import {useNavigate} from 'react-router';
import BackLink from '../components/BackLink';

export default function CreateApplicationPage(): ReactElement {
  const navigate = useNavigate();

  return (
    <>
      <BackLink to="/applications" label="Applications" />
      {/*
        A confidential client's secret is shown once; `onCreated` fires after it has been dismissed. No organization
        unit is passed, so the SDK creates the application in the current project when one is chosen.
      */}
      <ApplicationCreate
        title="Create application"
        onCreated={(application) => void navigate(`/applications/${application.id}`, {replace: true})}
        onCancel={() => void navigate('/applications')}
      />
    </>
  );
}
