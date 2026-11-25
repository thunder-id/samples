// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {getFlows, useManagementRequestConfig, type ManagedFlowListResponse} from '@thunderid/react';
import {useEffect, useState, type ReactElement} from 'react';
import {Link} from 'react-router';

const PAGE_SIZE = 20;

interface FlowsState {
  error: boolean;
  page?: ManagedFlowListResponse;
}

// The SDK has no flow list component, so this page calls its `getFlows` function and draws the table itself. A flow
// is opened to manage its sharing policies.
export default function FlowsPage(): ReactElement {
  const config = useManagementRequestConfig('flows');
  const [offset, setOffset] = useState<number>(0);
  const [state, setState] = useState<FlowsState>({error: false});

  useEffect(() => {
    let active = true;

    getFlows({...config, limit: PAGE_SIZE, offset}).then(
      (page: ManagedFlowListResponse) => active && setState({error: false, page}),
      () => active && setState({error: true}),
    );

    return () => {
      active = false;
    };
  }, [config, offset]);

  const flows = state.page?.flows ?? [];
  const total: number = state.page?.totalResults ?? 0;
  const loading: boolean = !state.page && !state.error;

  return (
    <>
      <div className="admin-header">
        <div>
          <div className="admin-title-row">
            <h2 className="admin-content-title">Flows</h2>
            {total > 0 ? <span className="admin-count-pill">{total}</span> : null}
          </div>
          <p className="admin-content-subtitle admin-content-subtitle--tight">
            The sign-in, registration and administration flows on your ThunderID server. Open one to share it with other
            organization units.
          </p>
        </div>
      </div>

      {state.error ? (
        <div className="admin-alert" role="alert">
          The flows could not be loaded. Check that you signed in as an administrator.
        </div>
      ) : null}

      {loading ? <p className="admin-content-subtitle">Loading flows…</p> : null}

      {flows.length > 0 ? (
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Flow</th>
                <th>Type</th>
                <th className="admin-col-id">Handle</th>
              </tr>
            </thead>
            <tbody>
              {flows.map((flow) => (
                <tr key={flow.id}>
                  <td>
                    <Link to={`/flows/${flow.id}`} className="admin-agent-name">
                      {flow.name}
                    </Link>
                  </td>
                  <td>
                    <span className="admin-pill">{flow.flowType}</span>
                  </td>
                  <td className="admin-col-id">
                    <code className="admin-id-chip">{flow.handle}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {total > PAGE_SIZE ? (
            <div className="admin-pager">
              <span className="admin-pager-range">
                Showing {offset + 1} to {Math.min(offset + PAGE_SIZE, total)} of {total}
              </span>
              <div className="admin-pager-buttons">
                <button
                  type="button"
                  className="admin-btn"
                  disabled={offset === 0}
                  onClick={() => setOffset(offset - PAGE_SIZE)}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="admin-btn"
                  disabled={offset + PAGE_SIZE >= total}
                  onClick={() => setOffset(offset + PAGE_SIZE)}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
