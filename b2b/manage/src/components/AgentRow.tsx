// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {memo, type ReactElement} from 'react';
import AgentAvatar from './AgentAvatar';
import TrashIcon from './icons/TrashIcon';
import {agentName, type Agent} from '../api/agents';

interface AgentRowProps {
  agent: Agent;
  onDelete: (agent: Agent) => void;
}

function AgentRow({agent, onDelete}: AgentRowProps): ReactElement {
  const name: string = agentName(agent);

  return (
    <tr>
      <td>
        <div className="manage-agent">
          <AgentAvatar id={agent.id} name={name} />
          <div className="manage-agent-text">
            <div className="manage-agent-name">{name}</div>
            {agent.description ? <div className="manage-agent-desc">{agent.description}</div> : null}
          </div>
        </div>
      </td>
      <td className="manage-col-id">
        <code className="manage-id-chip" title={agent.id}>
          {agent.id}
        </code>
      </td>
      <td>
        <span className="manage-pill">{agent.ouHandle ?? agent.ouId}</span>
      </td>
      <td className="manage-table-actions">
        <button
          type="button"
          className="manage-icon-btn manage-icon-btn--danger"
          aria-label={`Delete ${name}`}
          title="Delete"
          onClick={() => onDelete(agent)}
        >
          <TrashIcon />
        </button>
      </td>
    </tr>
  );
}

// The list re-renders when a dialog opens or a page loads. A row only needs to when its own agent changes.
export default memo(AgentRow);
