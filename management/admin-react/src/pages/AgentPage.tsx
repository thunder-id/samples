// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {AgentDetails} from '@thunderid/react';
import type {ReactElement} from 'react';
import {useNavigate, useParams} from 'react-router';
import BackLink from '../components/BackLink';

export default function AgentPage(): ReactElement {
  const navigate = useNavigate();
  const {id = ''} = useParams();

  return (
    <>
      <BackLink to="/agents" label="Agents" />
      <AgentDetails
        key={id}
        agentId={id}
        deletable
        lifecycleActions
        onDeleted={() => void navigate('/agents', {replace: true})}
      />
    </>
  );
}
