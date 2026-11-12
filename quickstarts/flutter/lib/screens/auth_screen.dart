// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:material_ui/material_ui.dart';
import 'package:thunderid_flutter/thunderid_flutter.dart';
import '../legacy_material.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  static const _blue = Color(0xFF3688FF);
  static const _muted = Color(0xFF5A7085);
  static const _darkBg = Color(0xFF080f1c);
  static const _lightBg = Color(0xFFF7F9FC);

  static const _featureTags = ['OAuth 2.0', 'PKCE', 'JWT', 'MFA', 'SSO'];

  void _showSheet(BuildContext context, String mode) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _AuthSheet(initialMode: mode),
    );
  }

  @override
  Widget build(BuildContext context) {
    final brightness = Theme.of(context).brightness;
    final isDark = brightness == Brightness.dark;
    final bgColor = isDark ? _darkBg : _lightBg;
    final textColor = isDark ? Colors.white : const Color(0xFF05213F);

    const logoHeight = 72.0;
    const logoWidth = logoHeight * (207 / 257);

    return Scaffold(
      backgroundColor: bgColor,
      body: Stack(
        children: [
          SafeArea(
            child: Column(
              children: [
                // ── Identity section ────────────────────────────────────────
                Expanded(
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 28),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          CustomPaint(
                            painter: _TdMarkPainter(dark: isDark),
                            size: const Size(logoWidth, logoHeight),
                          ),
                          const SizedBox(height: 28),
                          Text(
                            'Authentication for developers.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                              letterSpacing: -1.4,
                              color: textColor,
                              height: 1.2,
                            ),
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'OAuth 2.0, PKCE, MFA, and JWT - out of the box in minutes.',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 15,
                              color: _muted,
                              height: 1.5,
                            ),
                          ),
                          const SizedBox(height: 20),
                          SizedBox(
                            height: 36,
                            child: SingleChildScrollView(
                              scrollDirection: Axis.horizontal,
                              child: Row(
                                children: _featureTags.map((tag) {
                                  return Padding(
                                    padding: const EdgeInsets.only(right: 8),
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 12, vertical: 6),
                                      decoration: BoxDecoration(
                                        border: Border.all(
                                          color: _blue.withValues(alpha: 0.4),
                                        ),
                                        borderRadius: BorderRadius.circular(20),
                                      ),
                                      child: Text(
                                        tag,
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: _blue,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ),
                                  );
                                }).toList(),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                // ── Bottom CTAs ─────────────────────────────────────────────
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 0, 24, 48),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      ElevatedButton.icon(
                        onPressed: () => _showSheet(context, 'signup'),
                        icon: const Icon(Icons.arrow_forward, size: 18),
                        label: const Text('Get started'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _blue,
                          foregroundColor: Colors.white,
                          minimumSize: const Size.fromHeight(52),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          textStyle: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      OutlinedButton(
                        onPressed: () => _showSheet(context, 'login'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: _blue,
                          side: const BorderSide(color: _blue),
                          minimumSize: const Size.fromHeight(52),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          textStyle: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        child: const Text('Sign in'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Auth bottom sheet
// ─────────────────────────────────────────────────────────────────────────────

class _AuthSheet extends StatefulWidget {
  final String initialMode;
  const _AuthSheet({required this.initialMode});

  @override
  State<_AuthSheet> createState() => _AuthSheetState();
}

class _AuthSheetState extends State<_AuthSheet> {
  late String _mode;

  @override
  void initState() {
    super.initState();
    _mode = widget.initialMode;
  }

  @override
  Widget build(BuildContext context) {
    final applicationId = dotenv.env['THUNDERID_APP_ID'] ?? '';
    final brightness = Theme.of(context).brightness;
    final isDark = brightness == Brightness.dark;
    final sheetBg = isDark ? const Color(0xFF0d1627) : Colors.white;

    return DraggableScrollableSheet(
      initialChildSize: 0.85,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      expand: false,
      builder: (ctx, scrollController) {
        return Container(
          decoration: BoxDecoration(
            color: sheetBg,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              const SizedBox(height: 12),
              Container(
                width: 36,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 8),
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  padding: const EdgeInsets.fromLTRB(24, 8, 24, 32),
                  child: LegacyMaterial(child: _buildSheetContent(ctx, applicationId)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSheetContent(BuildContext context, String applicationId) {
    // The bottom sheet is pushed via the Navigator, so it doesn't automatically dismiss
    // just because the app's root widget swaps from AuthScreen to HomeScreen once signed in —
    // it must be popped explicitly once the flow completes, or it's left stuck showing its
    // final "complete" spinner on top of the (already rendered) home screen underneath.
    switch (_mode) {
      case 'login':
        return SignIn(
          applicationId: applicationId,
          onSuccess: (_) => Navigator.of(context).pop(),
        );
      case 'signup':
        return SignUp(
          applicationId: applicationId,
          onSuccess: () => Navigator.of(context).pop(),
        );
      default:
        return const SizedBox.shrink();
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ThunderID logo mark painter
// ─────────────────────────────────────────────────────────────────────────────

class _TdMarkPainter extends CustomPainter {
  final bool dark;
  const _TdMarkPainter({required this.dark});

  @override
  void paint(Canvas canvas, Size size) {
    final scale = size.height / 257;

    canvas.save();
    canvas.scale(scale, scale);

    // Path 1 — dark fill (onSurface color)
    final darkPaint = Paint()
      ..color = dark ? Colors.white : const Color(0xFF05213F)
      ..style = PaintingStyle.fill;

    final path1 = Path()
      ..moveTo(55.4763, 26.4391)
      ..lineTo(58.8866, 0)
      ..lineTo(0, 0)
      ..lineTo(0, 26.4391)
      ..close();

    canvas.drawPath(path1, darkPaint);

    // Path 2 & 3 — blue fill
    final bluePaint = Paint()
      ..color = const Color(0xFF3688FF)
      ..style = PaintingStyle.fill;

    final path2 = Path()
      ..moveTo(39.8438, 147.407)
      ..lineTo(49.5455, 72.2839)
      ..lineTo(0, 72.2839)
      ..lineTo(0, 256.743)
      ..lineTo(60.5602, 256.743)
      ..lineTo(80.048, 147.407)
      ..lineTo(39.8438, 147.407)
      ..close();

    canvas.drawPath(path2, bluePaint);

    final path3 = Path()
      ..moveTo(192.42, 59.361)
      ..cubicTo(182.782, 40.2307, 168.929, 25.5705, 150.903, 15.3381)
      ..cubicTo(145.501, 12.2662, 139.761, 9.6605, 133.703, 7.5208)
      ..lineTo(115.401, 103.702)
      ..lineTo(159.757, 103.702)
      ..lineTo(76.2987, 256.743)
      ..lineTo(83.3735, 256.743)
      ..cubicTo(109.449, 256.743, 131.69, 251.574, 150.14, 241.236)
      ..cubicTo(168.569, 230.897, 182.634, 216.131, 192.356, 196.959)
      ..cubicTo(202.058, 177.765, 206.909, 154.8, 206.909, 128.043)
      ..cubicTo(206.909, 101.286, 202.079, 78.5123, 192.441, 59.3821)
      ..lineTo(192.42, 59.361)
      ..close();

    canvas.drawPath(path3, bluePaint);

    canvas.restore();
  }

  @override
  bool shouldRepaint(_TdMarkPainter oldDelegate) => oldDelegate.dark != dark;
}
