// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState, type ReactElement} from 'react';
import {Link} from 'react-router';
import useAgentsApi, {agentName, type Agent} from '../api/agents';
import AgentRow from '../components/AgentRow';
import ConfirmDialog from '../components/ConfirmDialog';
import AgentIcon from '../components/icons/AgentIcon';
import PlusIcon from '../components/icons/PlusIcon';

const PAGE_SIZE = 10;

const SKELETON_ROWS: ReactElement[] = [0, 1, 2, 3].map((index) => (
  <tr key={index} className="manage-skeleton-row" aria-hidden="true">
    <td>
      <div className="manage-agent">
        <span className="manage-skeleton manage-skeleton--avatar" />
        <span className="manage-skeleton manage-skeleton--text" />
      </div>
    </td>
    <td className="manage-col-id">
      <span className="manage-skeleton manage-skeleton--chip" />
    </td>
    <td>
      <span className="manage-skeleton manage-skeleton--pill" />
    </td>
    <td />
  </tr>
));

function EmptyAgents(): ReactElement {
  return (
    <div className="manage-empty">
      <span className="manage-empty-icon">
        <AgentIcon size={28} />
      </span>
      <div className="manage-empty-title">No agents yet</div>
      <p className="manage-empty-text">Agents you create show up here. Start with your first one.</p>
      <Link to="/agents/new" className="manage-primary-link manage-primary-link--icon">
        <PlusIcon />
        Create agent
      </Link>
    </div>
  );
}

export default function AgentsPage(): ReactElement {
  const {deleteAgent, listAgents} = useAgentsApi();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Agent | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const load = useCallback(
    async (from: number): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const result = await listAgents(PAGE_SIZE, from);
        setAgents(result.agents ?? []);
        setTotal(result.totalResults ?? 0);
        setOffset(from);
      } catch {
        setError('The agents could not be loaded. Check that you signed in as an administrator.');
      } finally {
        setLoading(false);
      }
    },
    [listAgents],
  );

  useEffect(() => {
    void load(0);
  }, [load]);

  const confirmDelete = async (): Promise<void> => {
    if (!pendingDelete) {
      return;
    }

    setDeleting(true);
    try {
      await deleteAgent(pendingDelete.id);
      setPendingDelete(null);
      // Step back a page when the last agent of a later page was deleted.
      await load(agents.length === 1 && offset > 0 ? offset - PAGE_SIZE : offset);
    } catch {
      setPendingDelete(null);
      setError('The agent could not be deleted.');
    } finally {
      setDeleting(false);
    }
  };

  // What to show is worked out from the state on every render, not kept in more state.
  const firstLoad: boolean = loading && agents.length === 0;
  const showEmpty: boolean = !loading && !error && agents.length === 0;
  const showTable: boolean = firstLoad || agents.length > 0;

  return (
    <>
      <div className="manage-header">
        <div>
          <div className="manage-title-row">
            <h2 className="manage-content-title">Agents</h2>
            {total > 0 ? <span className="manage-count-pill">{total}</span> : null}
          </div>
          <p className="manage-content-subtitle manage-content-subtitle--tight">
            The agents registered on your ThunderID server.
          </p>
        </div>
        <Link to="/agents/new" className="manage-primary-link manage-primary-link--icon">
          <PlusIcon />
          Create agent
        </Link>
      </div>

      {error ? (
        <div className="manage-alert" role="alert">
          {error}
        </div>
      ) : null}

      {showEmpty ? (
        <div className="manage-table-card">
          <EmptyAgents />
        </div>
      ) : null}

      {showTable ? (
        <div className="manage-table-card" aria-busy={loading}>
          <table className={loading && !firstLoad ? 'manage-table manage-table--busy' : 'manage-table'}>
            <thead>
              <tr>
                <th>Agent</th>
                <th className="manage-col-id">Agent ID</th>
                <th>Organization unit</th>
                <th className="manage-table-actions">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {firstLoad
                ? SKELETON_ROWS
                : agents.map((agent) => <AgentRow key={agent.id} agent={agent} onDelete={setPendingDelete} />)}
            </tbody>
          </table>

          {total > PAGE_SIZE ? (
            <div className="manage-pager">
              <span className="manage-pager-range">
                Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
              </span>
              <div className="manage-pager-buttons">
                <button
                  type="button"
                  className="manage-btn"
                  disabled={offset === 0 || loading}
                  onClick={() => void load(offset - PAGE_SIZE)}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="manage-btn"
                  disabled={offset + PAGE_SIZE >= total || loading}
                  onClick={() => void load(offset + PAGE_SIZE)}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {pendingDelete ? (
        <ConfirmDialog
          busy={deleting}
          confirmLabel="Delete"
          description={`This deletes ${agentName(pendingDelete)} for good. Anything that signs in as this agent stops working.`}
          title="Delete agent?"
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => void confirmDelete()}
        />
      ) : null}
    </>
  );
}
