// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {OrganizationUnitSwitcher, type AccessibleOrganizationUnit} from '@thunderid/react';
import type {ChangeEvent, ReactElement} from 'react';

// The organization units the signed-in administrator can access, as a compact select in the top bar. The SDK loads
// the units and switches the session; the sample draws the select itself through the switcher's custom render,
// since the default view is a full list. Choosing a unit signs the session into it.
export default function OrganizationUnitMenu(): ReactElement {
  return (
    <OrganizationUnitSwitcher limit={100}>
      {({current, error, isLoading, onSwitch, organizationUnits, switchingId}) => {
        const onChange = (event: ChangeEvent<HTMLSelectElement>): void => {
          const unit: AccessibleOrganizationUnit | undefined = organizationUnits.find(
            ({id}: AccessibleOrganizationUnit) => id === event.target.value,
          );

          if (unit) {
            onSwitch(unit);
          }
        };

        // With one unit or none there is nothing to switch to.
        if (!error && organizationUnits.length < 2) {
          return null;
        }

        return (
          <label className="nav-ou" title={error ?? undefined}>
            <span className="sr-only">Organization unit</span>
            <select
              className="nav-ou-select"
              value={switchingId ?? current ?? ''}
              disabled={isLoading || switchingId !== null || organizationUnits.length === 0}
              aria-invalid={error ? true : undefined}
              onChange={onChange}
            >
              {current === null ? <option value="">Organization unit</option> : null}
              {organizationUnits.map(({handle, id, name}: AccessibleOrganizationUnit) => (
                <option key={id} value={id}>
                  {name} ({handle})
                </option>
              ))}
            </select>
          </label>
        );
      }}
    </OrganizationUnitSwitcher>
  );
}
