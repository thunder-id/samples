// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useThunderID} from '@thunderid/react';
import {useCallback} from 'react';

export interface Agent {
  clientId?: string;
  description?: string;
  // What the agent type shows as the agent's name (its `name` attribute for the default type).
  display?: string;
  id: string;
  name?: string;
  ouHandle?: string;
  ouId: string;
  type: string;
}

export interface AgentList {
  agents: Agent[];
  totalResults: number;
}

export const agentName = (agent: Agent): string => agent.display ?? agent.name ?? agent.id;

export interface AgentsApi {
  deleteAgent: (id: string) => Promise<void>;
  listAgents: (limit: number, offset: number) => Promise<AgentList>;
}

type Request = Parameters<ReturnType<typeof useThunderID>['http']['request']>[0];

// Every call goes through the SDK's authenticated HTTP client, which adds the signed-in user's access token.
export default function useAgentsApi(): AgentsApi {
  const {baseUrl, http} = useThunderID();

  const listAgents = useCallback(
    async (limit: number, offset: number): Promise<AgentList> => {
      const query: string = new URLSearchParams({
        include: 'display',
        limit: String(limit),
        offset: String(offset),
      }).toString();
      const response = await http.request({method: 'GET', url: `${baseUrl}/agents?${query}`} as unknown as Request);

      return response.data as AgentList;
    },
    [baseUrl, http],
  );

  const deleteAgent = useCallback(
    async (id: string): Promise<void> => {
      await http.request({method: 'DELETE', url: `${baseUrl}/agents/${encodeURIComponent(id)}`} as unknown as Request);
    },
    [baseUrl, http],
  );

  return {deleteAgent, listAgents};
}
