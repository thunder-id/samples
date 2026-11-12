// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import 'package:material_ui/material_ui.dart';
import 'package:thunderid_flutter/thunderid_flutter.dart';
import 'screens/auth_screen.dart';
import 'screens/home_screen.dart';

class QuickstartApp extends StatelessWidget {
  const QuickstartApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ThunderID Quickstart',
      theme: ThemeData(
        colorSchemeSeed: const Color(0xFF3688FF),
        useMaterial3: true,
      ),
      // thunderid_flutter widgets still use package:flutter/material.dart.
      // ignore: deprecated_member_use
      builder: (context, child) => MaterialUiCompatibilityBridge(child: child!),
      home: const _RootScreen(),
    );
  }
}

class _RootScreen extends StatelessWidget {
  const _RootScreen();

  @override
  Widget build(BuildContext context) {
    final thunder = ThunderIDProvider.of(context);

    if (thunder.isLoading) {
      return const Scaffold(
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 12),
              Text('Starting ThunderID…'),
            ],
          ),
        ),
      );
    }

    if (thunder.error != null) {
      return Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Text(
              'Configuration error: ${thunder.error}\n\nCheck your .env values.',
              textAlign: TextAlign.center,
            ),
          ),
        ),
      );
    }

    return thunder.isSignedIn ? const HomeScreen() : const AuthScreen();
  }
}
