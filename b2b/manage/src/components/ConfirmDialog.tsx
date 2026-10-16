// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Button} from '@thunderid/react';
import type {ReactElement} from 'react';

interface ConfirmDialogProps {
  busy: boolean;
  confirmLabel: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
}

export default function ConfirmDialog({
  busy,
  confirmLabel,
  description,
  onCancel,
  onConfirm,
  title,
}: ConfirmDialogProps): ReactElement {
  return (
    <div className="manage-dialog-backdrop" role="presentation">
      <div className="manage-dialog" role="dialog" aria-modal="true" aria-labelledby="manage-dialog-title">
        <h3 id="manage-dialog-title" className="manage-dialog-title">
          {title}
        </h3>
        <p className="manage-dialog-text">{description}</p>
        <div className="manage-dialog-actions">
          <Button variant="outline" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <button type="button" className="manage-danger-btn" onClick={onConfirm} disabled={busy}>
            {busy ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
