// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {ReactElement} from 'react';
import {Link} from 'react-router';

export default function BackLink({label, to}: {label: string; to: string}): ReactElement {
  return (
    <Link to={to} className="admin-back-link">
      <span aria-hidden="true">←</span> {label}
    </Link>
  );
}
