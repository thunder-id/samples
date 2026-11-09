// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {getFlow, SharingPolicies, useManagementRequestConfig, type ManagedFlowDefinition} from '@thunderid/react';
import type {ReactElement} from 'react';
import {useParams} from 'react-router';
import useRecord from '../api/useRecord';
import BackLink from '../components/BackLink';

export default function FlowPage(): ReactElement {
  const {id = ''} = useParams();
  const config = useManagementRequestConfig('flows');
  const {error, record: flow} = useRecord<ManagedFlowDefinition>(() => getFlow({...config, flowId: id}), id);

  return (
    <>
      <BackLink to="/flows" label="Flows" />
      {error ? (
        <div className="admin-alert" role="alert">
          The flow could not be loaded.
        </div>
      ) : null}
      {flow ? (
        <div className="admin-header">
          <div>
            <h2 className="admin-content-title">{flow.name}</h2>
            <p className="admin-content-subtitle admin-content-subtitle--tight">
              Version {flow.activeVersion} is active.
            </p>
            <span className="admin-pill">{flow.flowType}</span> <code className="admin-id-chip">{flow.handle}</code>
          </div>
        </div>
      ) : null}
      {/* Sharing policies decide which other organization units can use this flow. */}
      <SharingPolicies key={id} resourceType="flow" resourceId={id} editable />
    </>
  );
}
