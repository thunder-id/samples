// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useThunderID} from '@thunderid/react';
import {useEffect, useState} from 'react';
import {onboardingFlowHandle} from '../config';

const FLOW_TYPE = 'ADMINISTRATION';
const PAGE_SIZE = 100;

interface FlowSummary {
  flowType: string;
  handle: string;
  id: string;
}

type Request = Parameters<ReturnType<typeof useThunderID>['http']['request']>[0];

export type OnboardingFlow =
  | {status: 'loading'}
  | {flowId: string; status: 'ready'}
  | {handle: string; status: 'missing'}
  | {message: string; status: 'failed'};

// The flow is named by its handle in the environment, but `/flow/execute` starts a flow by ID. So the ID is looked up
// among the administration flows, the way the Console does it.
export default function useOnboardingFlow(): OnboardingFlow {
  const {baseUrl, http} = useThunderID();
  const [flow, setFlow] = useState<OnboardingFlow>({status: 'loading'});

  useEffect(() => {
    let cancelled = false;

    const findFlow = async (): Promise<OnboardingFlow> => {
      for (let offset = 0; ; offset += PAGE_SIZE) {
        const query: string = new URLSearchParams({
          flowType: FLOW_TYPE,
          limit: String(PAGE_SIZE),
          offset: String(offset),
        }).toString();
        const response = await http.request({method: 'GET', url: `${baseUrl}/flows?${query}`} as unknown as Request);
        const flows: FlowSummary[] = (response.data as {flows?: FlowSummary[]}).flows ?? [];
        const match: FlowSummary | undefined = flows.find((candidate) => candidate.handle === onboardingFlowHandle);

        if (match) {
          return {flowId: match.id, status: 'ready'};
        }
        if (flows.length < PAGE_SIZE) {
          return {handle: onboardingFlowHandle, status: 'missing'};
        }
      }
    };

    findFlow()
      .then((result) => !cancelled && setFlow(result))
      .catch((error: unknown) => {
        if (!cancelled) {
          setFlow({
            message: error instanceof Error ? error.message : 'The flows could not be loaded.',
            status: 'failed',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [baseUrl, http]);

  return flow;
}
