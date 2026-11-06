// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {AgentList, useThunderID} from '@thunderid/react';
import type {ReactElement} from 'react';
import {Link, useNavigate} from 'react-router';
import PlusIcon from '../components/icons/PlusIcon';

export default function AgentsPage(): ReactElement {
  const navigate = useNavigate();
  const {currentProject} = useThunderID();

  return (
    <AgentList
      title="Agents"
      description={
        currentProject
          ? `The agents in the ${currentProject.displayName} project, and the ones shared into it.`
          : 'The agents registered on your ThunderID server.'
      }
      onSelect={(agent) => void navigate(`/agents/${agent.id}`)}
      actions={
        <div className="admin-actions">
          <Link to="/agents/onboard" className="admin-btn">
            Onboard with a flow
          </Link>
          <Link to="/agents/new" className="admin-primary-link admin-primary-link--icon">
            <PlusIcon />
            Create agent
          </Link>
        </div>
      }
    />
  );
}
