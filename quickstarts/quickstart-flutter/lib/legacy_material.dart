// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

// thunderid_flutter widgets are still built with package:flutter/material.dart, so their text
// fields and ink effects need a Material ancestor from that library. MaterialUiCompatibilityBridge
// only maps the theme and localizations, so each surface that hosts those widgets adds one.
// ignore: deprecated_member_use
import 'package:flutter/material.dart' as legacy;
import 'package:flutter/widgets.dart';

class LegacyMaterial extends StatelessWidget {
  final Widget child;

  const LegacyMaterial({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return legacy.Material(type: legacy.MaterialType.transparency, child: child);
  }
}
