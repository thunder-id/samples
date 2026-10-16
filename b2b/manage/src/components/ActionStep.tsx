// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Button, resolveFlowTemplateLiterals, useTranslation} from '@thunderid/react';
import type {ReactElement} from 'react';
import type {FlowComponent, RenderContext} from './OrganizationUnitStep';

// The SDK stretches a flow's action button across the whole card, as a sign-in form does. The ThunderID Console lays
// out the same step differently: the button sits on the right at its natural width. The sample draws the action itself
// so it matches the Console. It does what the SDK's own button does: a submit action sends the answers on, and any
// other action clears the form and sends nothing.
export default function ActionStep({
  component,
  context,
}: {
  component: FlowComponent;
  context: RenderContext;
}): ReactElement {
  const {t} = useTranslation();
  const isSubmit: boolean = (component.eventType ?? '').toUpperCase() === 'SUBMIT';
  const isPrimary: boolean = component.variant?.toLowerCase() === 'primary';
  const label: string = component.label ? resolveFlowTemplateLiterals(component.label, {meta: context.meta, t}) : '';

  const handleClick = (): void => {
    if (!context.onSubmit) {
      return;
    }
    if (isSubmit) {
      context.onSubmit(component, {...context.formValues}, false);

      return;
    }
    context.resetForm?.();
    context.onSubmit(component, {}, true);
  };

  return (
    <div className="manage-flow-actions">
      <Button
        color={isPrimary ? 'primary' : 'secondary'}
        disabled={context.isLoading || (isSubmit && !context.isFormValid)}
        id={component.id}
        onClick={handleClick}
        style={{minWidth: 140}}
        variant={isPrimary ? 'solid' : 'outline'}
      >
        {label || 'Submit'}
      </Button>
    </div>
  );
}
