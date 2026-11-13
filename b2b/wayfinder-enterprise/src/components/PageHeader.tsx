// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';

interface PageHeaderProps {
  description: ReactNode;
  eyebrow: string;
  title: string;
}

export default function PageHeader({ description, eyebrow, title }: PageHeaderProps) {
  return (
    <header className="page-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
    </header>
  );
}
