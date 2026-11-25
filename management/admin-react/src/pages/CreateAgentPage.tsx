// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {AgentCreate} from '@thunderid/react';
import type {ReactElement} from 'react';
import {useNavigate} from 'react-router';
import BackLink from '../components/BackLink';

export default function CreateAgentPage(): ReactElement {
  const navigate = useNavigate();

  return (
    <>
      <BackLink to="/agents" label="Agents" />
      {/*
        No organization unit is passed, so the SDK creates the agent in the current project when one is chosen, and in
        your own organization unit otherwise. To run the server's onboarding flow instead, use /agents/onboard.
      */}
      <AgentCreate
        title="Create agent"
        onCreated={(agent) => void navigate(`/agents/${agent.id}`, {replace: true})}
        onCancel={() => void navigate('/agents')}
      />
    </>
  );
}
