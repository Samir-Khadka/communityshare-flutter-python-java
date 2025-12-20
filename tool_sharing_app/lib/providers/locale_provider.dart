import 'package:flutter/material.dart';

class LocaleProvider with ChangeNotifier {
  Locale _currentLocale = const Locale('en');

  Locale get currentLocale => _currentLocale;

  void setLocale(Locale locale) {
    if (!['en', 'es', 'fr'].contains(locale.languageCode)) return;
    _currentLocale = locale;
    notifyListeners();
  }
}
