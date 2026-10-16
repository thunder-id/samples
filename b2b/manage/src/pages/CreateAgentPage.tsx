// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {
  BaseInviteUser,
  Button,
  useFetchAuthFlows,
  useFetchUsers,
  useFetchUserTypes,
  useThunderID,
  type InviteUserFlowResponse,
} from '@thunderid/react';
import {useCallback, useState, type ReactElement} from 'react';
import {Link, useNavigate} from 'react-router';
import useOnboardingFlow from '../api/useOnboardingFlow';

type Request = Parameters<ReturnType<typeof useThunderID>['http']['request']>[0];

// Creating an agent is a ThunderID flow. This page starts the flow named in the environment, sends each step's
// answers back to the server, and draws each screen the server returns.
export default function CreateAgentPage(): ReactElement {
  const {baseUrl, http, isInitialized} = useThunderID();
  const flow = useOnboardingFlow();
  const fetchAuthFlows = useFetchAuthFlows();
  const fetchUsers = useFetchUsers();
  const fetchUserTypes = useFetchUserTypes();
  const [flowError, setFlowError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [complete, setComplete] = useState<boolean>(false);
  // Changing the key starts the flow again from its first step.
  const [run, setRun] = useState<number>(0);

  const execute = useCallback(
    async (payload: Record<string, unknown>): Promise<InviteUserFlowResponse> => {
      const response = await http.request({
        data: payload,
        method: 'POST',
        url: `${baseUrl}/flow/execute`,
      } as unknown as Request);

      return response.data as InviteUserFlowResponse;
    },
    [baseUrl, http],
  );

  const renderBody = (): ReactElement => {
    if (flow.status === 'loading') {
      return <p className="manage-content-subtitle">Looking for the onboarding flow…</p>;
    }
    if (flow.status === 'failed') {
      return (
        <div className="manage-alert" role="alert">
          The onboarding flow could not be looked up: {flow.message}
        </div>
      );
    }
    if (flow.status === 'missing') {
      return (
        <div className="manage-alert" role="alert">
          No administration flow with the handle <code>{flow.handle}</code> exists on your server. Set
          VITE_AGENT_ONBOARDING_FLOW_HANDLE in the .env file.
        </div>
      );
    }

    return (
      <>
        {flowError && (
          <div className="manage-alert" role="alert">
            {flowError}
          </div>
        )}
        <BaseInviteUser
          key={run}
          isInitialized={isInitialized}
          fetchAuthFlows={fetchAuthFlows}
          fetchUsers={fetchUsers}
          fetchUserTypes={fetchUserTypes}
          onInitialize={(payload) => execute({...payload, flowId: flow.flowId, verbose: true})}
          onSubmit={execute}
          onError={(error: Error) => setFlowError(error.message)}
          onFlowChange={(response: InviteUserFlowResponse) => {
            setFlowError(null);
            setComplete(response.flowStatus === 'COMPLETE');
          }}
        />
        {complete && (
          <div className="manage-flow-done">
            <Button
              variant="outline"
              onClick={() => {
                void navigate('/agents');
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setComplete(false);
                setFlowError(null);
                setRun((current) => current + 1);
              }}
            >
              Create another agent
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Link to="/agents" className="manage-back">
        ← Agents
      </Link>
      {renderBody()}
    </>
  );
}
