// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {ComponentRenderer} from '@thunderid/react';
import ActionStep from './components/ActionStep';
import OrganizationUnitStep from './components/OrganizationUnitStep';

// The flow components the sample draws itself: the organization unit input, which the SDK does not draw, and the
// action button, which the sample lays out like the Console does. The SDK draws every other type of the flow.
export const renderers: Record<string, ComponentRenderer> = {
  ACTION: (component, context) => <ActionStep component={component} context={context} />,
  OU_SELECT: (component, context) => <OrganizationUnitStep component={component} context={context} />,
};
