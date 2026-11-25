// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import 'package:material_ui/material_ui.dart';
import 'package:thunderid_flutter/thunderid_flutter.dart';
import '../legacy_material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Profile'),
        centerTitle: false,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: LegacyMaterial(
            child: UserProfile(
              onSaved: () => ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Profile saved')),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
