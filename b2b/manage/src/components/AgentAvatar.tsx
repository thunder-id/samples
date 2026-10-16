// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {CSSProperties, ReactElement} from 'react';

const WHITESPACE = /\s+/;

// Up to two capital letters from the first two words of the name.
const getInitials = (name: string): string => {
  const letters: string = name
    .trim()
    .split(WHITESPACE)
    .slice(0, 2)
    .map((word: string) => word.charAt(0))
    .join('');

  return letters.toUpperCase() || '?';
};

// The same agent always gets the same colour, so a row is easy to find again. The hash stays a 32-bit number
// until the end, so names that differ by one letter still land on different colours.
const getHue = (seed: string): number => {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash, 31) + seed.charCodeAt(index);
  }

  return Math.abs(hash) % 360;
};

export default function AgentAvatar({id, name}: {id: string; name: string}): ReactElement {
  return (
    <span
      className="manage-avatar"
      style={{'--avatar-hue': getHue(`${name}${id}`)} as CSSProperties}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
