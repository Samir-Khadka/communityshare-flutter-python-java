import 'package:flutter/material.dart';

class S {
  static const LocalizationsDelegate delegate = _SDelegate();

  static S of(BuildContext context) {
    return S();
  }
}

class _SDelegate extends LocalizationsDelegate<S> {
  const _SDelegate();

  @override
  bool isSupported(Locale locale) => ['en', 'es', 'fr'].contains(locale.languageCode);

  @override
  Future<S> load(Locale locale) async {
    return S();
  }

  @override
  bool shouldReload(_SDelegate old) => false;
}
