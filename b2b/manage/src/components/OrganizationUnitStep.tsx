// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {
  resolveFlowTemplateLiterals,
  Select,
  useThunderID,
  useTranslation,
  type ComponentRenderer,
} from '@thunderid/react';
import {useEffect, useState, type ReactElement} from 'react';

interface OrganizationUnit {
  handle?: string;
  id: string;
  name?: string;
}

type Request = Parameters<ReturnType<typeof useThunderID>['http']['request']>[0];
export type RenderContext = Parameters<ComponentRenderer>[1];
export type FlowComponent = Parameters<ComponentRenderer>[0];

// The flow asks for an organization unit when it cannot tell which one the agent belongs to. The SDK does not draw
// that input type, so this is the one piece of the flow the sample draws itself: a dropdown over the units of the server.
function OrganizationUnitStep({component, context}: {component: FlowComponent; context: RenderContext}): ReactElement {
  const {baseUrl, http} = useThunderID();
  const {t} = useTranslation();
  const [units, setUnits] = useState<OrganizationUnit[]>([]);
  const name: string = component.ref ?? component.id;
  const resolve = (text?: string): string => (text ? resolveFlowTemplateLiterals(text, {meta: context.meta, t}) : '');

  useEffect(() => {
    http
      .request({method: 'GET', url: `${baseUrl}/organization-units?limit=100`} as unknown as Request)
      .then((response) => setUnits((response.data as {organizationUnits?: OrganizationUnit[]}).organizationUnits ?? []))
      .catch(() => setUnits([]));
  }, [baseUrl, http]);

  return (
    <Select
      id={component.id}
      label={resolve(component.label)}
      name={name}
      options={units.map((unit) => ({label: unit.name ?? unit.handle ?? unit.id, value: unit.id}))}
      required={Boolean(component.required)}
      error={context.touchedFields[name] ? context.formErrors[name] : undefined}
      value={context.formValues[name] ?? ''}
      onBlur={() => context.onInputBlur?.(name)}
      onChange={(event) => context.onInputChange(name, event.target.value)}
    />
  );
}

export default OrganizationUnitStep;
