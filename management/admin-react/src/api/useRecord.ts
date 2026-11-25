// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react';

export interface RecordState<T> {
  error: boolean;
  record?: T;
}

// Loads one record for a page header, such as a group's name and organization unit. The SDK's list, members and
// assignments components fetch their own data; the page only needs the record they belong to.
export default function useRecord<T>(load: () => Promise<T>, key: string): RecordState<T> {
  const [state, setState] = useState<RecordState<T>>({error: false});

  useEffect(() => {
    let active = true;

    setState({error: false});
    load().then(
      (record: T) => active && setState({error: false, record}),
      () => active && setState({error: true}),
    );

    return () => {
      active = false;
    };
    // The key identifies the record; `load` is recreated on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
