// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CABINS, TravelPolicy } from '@/lib/travel';

const usd = (amount: number) => `$${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

/** Spells out, for the policy being edited, which fares members book freely, which need approval, and which they cannot book. */
function PolicyPreview({ policy }: { policy: TravelPolicy }) {
  const rank = CABINS.indexOf(policy.maxCabin);
  const approvalCap = policy.maxPrice * (1 + policy.approvalMarginPercent / 100);
  const approvalCabin = CABINS[rank + 1];
  const blockedCabins = CABINS.slice(rank + 2);

  const outcomes = [
    {
      status: 'in-policy',
      label: 'In policy',
      summary: 'Members book straight away.',
      rules: [`Fares up to ${usd(policy.maxPrice)}`, rank === 0 ? 'Economy only' : `${policy.maxCabin} or a lower cabin`],
    },
    {
      status: 'approval-required',
      label: 'Needs approval',
      summary: 'Members can still book. The flight is labeled as needing approval.',
      rules: [
        policy.approvalMarginPercent > 0 ? `Fares over ${usd(policy.maxPrice)}, up to ${usd(approvalCap)}` : null,
        approvalCabin ? `${approvalCabin} cabin` : null,
      ].filter((rule): rule is string => rule !== null),
    },
    {
      status: 'out-of-policy',
      label: 'Out of policy',
      summary: 'Members cannot book. Admins still can.',
      rules: [
        `Fares over ${usd(approvalCap)}`,
        blockedCabins.length > 0 ? `${blockedCabins.join(' or ')} cabin` : null,
      ].filter((rule): rule is string => rule !== null),
    },
  ];

  return (
    <aside className="panel policy-preview" aria-label="What members see">
      <div className="card-header">
        <div>
          <h2>What members see</h2>
          <p className="muted">Every flight is checked against these limits. This updates as you edit.</p>
        </div>
      </div>
      <ul className="outcome-list">
        {outcomes.map((outcome) => (
          <li key={outcome.status} className={`outcome ${outcome.status}`}>
            <span className={`badge ${outcome.status}`}>{outcome.label}</span>
            {outcome.rules.length > 0 ? (
              <ul>
                {outcome.rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            ) : (
              <p className="muted">No fare falls in this band.</p>
            )}
            <p className="muted">{outcome.summary}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default function PolicyEditor() {
  const [policy, setPolicy] = useState<TravelPolicy | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/policy')
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(setPolicy)
      .catch(() => setMessage({ kind: 'error', text: 'Could not load the travel policy.' }));
  }, []);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const response = await fetch('/api/policy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy),
      });
      const body = await response.json();
      if (response.ok) {
        setPolicy(body);
        setMessage({ kind: 'success', text: 'Travel policy saved. Employees see it the next time they search.' });
      } else {
        setMessage({ kind: 'error', text: body.error });
      }
    } catch {
      setMessage({ kind: 'error', text: 'Could not save the travel policy.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (!policy) {
    return message ? (
      <p className="alert error" role="alert">
        {message.text}
      </p>
    ) : (
      <p className="muted">Loading the travel policy…</p>
    );
  }

  return (
    <div className="policy-layout">
      <form className="panel" onSubmit={save}>
        <div className="card-header">
          <div>
            <h2>Booking limits</h2>
            <p className="muted">Members book anything within these limits without approval.</p>
          </div>
        </div>
        {message && (
          <p className={message.kind === 'error' ? 'alert error' : 'alert success'} role={message.kind === 'error' ? 'alert' : 'status'}>
            {message.text}
          </p>
        )}
        <fieldset className="rule-row stacked">
          <legend className="rule-text">
            <strong>Cabin</strong>
            <span className="muted">The highest cabin employees can book without approval.</span>
          </legend>
          <div className="choice-group">
            {CABINS.map((cabin) => (
              <label key={cabin} className="choice">
                <input
                  type="radio"
                  name="maxCabin"
                  value={cabin}
                  checked={policy.maxCabin === cabin}
                  onChange={() => setPolicy({ ...policy, maxCabin: cabin })}
                />
                <span>{cabin}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="rule-row">
          <label className="rule-text" htmlFor="max-price">
            <strong>Fare limit</strong>
            <span className="muted">The highest fare employees can book without approval.</span>
          </label>
          <span className="input-affix">
            <span aria-hidden="true">$</span>
            <input
              id="max-price"
              aria-label="Fare limit in USD"
              type="number"
              min={1}
              value={policy.maxPrice}
              onChange={(event) => setPolicy({ ...policy, maxPrice: Number(event.target.value) })}
            />
            <span aria-hidden="true">USD</span>
          </span>
        </div>
        <div className="rule-row">
          <label className="rule-text" htmlFor="approval-margin">
            <strong>Approval margin</strong>
            <span className="muted">How far over the limits a booking may go with approval. Beyond it, members cannot book.</span>
          </label>
          <span className="input-affix">
            <input
              id="approval-margin"
              aria-label="Approval margin in percent"
              type="number"
              min={0}
              max={100}
              value={policy.approvalMarginPercent}
              onChange={(event) => setPolicy({ ...policy, approvalMarginPercent: Number(event.target.value) })}
            />
            <span aria-hidden="true">%</span>
          </span>
        </div>
        <div className="form-actions">
          <button type="submit" className="button solid" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save policy'}
          </button>
        </div>
      </form>
      <PolicyPreview policy={policy} />
    </div>
  );
}
