import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

class ApiService {
  // Use 10.0.2.2 for Android emulator to connect to localhost on host machine
  // For web/real device/windows, use 'localhost'
  // Point to Python Gateway (Port 8000) which proxies to Java
  static String get _baseUrl {
    if (kIsWeb) return 'http://localhost:8000/api/v1';
    // For local desktop (Windows/macOS), use localhost
    try {
      if (defaultTargetPlatform == TargetPlatform.windows ||
          defaultTargetPlatform == TargetPlatform.macOS ||
          defaultTargetPlatform == TargetPlatform.linux) {
        return 'http://localhost:8000/api/v1';
      }
    } catch (_) {}
    return 'http://10.0.2.2:8000/api/v1';
  }

  static Future<dynamic> get(String endpoint) async {
    try {
      final response = await http.get(Uri.parse('$_baseUrl$endpoint'));
      return _processResponse(response);
    } catch (e) {
      debugPrint('API GET Error: $e');
      rethrow;
    }
  }

  static Future<dynamic> post(
      String endpoint, Map<String, dynamic> body) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl$endpoint'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );
      return _processResponse(response);
    } catch (e) {
      debugPrint('API POST Error: $e');
      rethrow;
    }
  }

  static Future<dynamic> patch(
      String endpoint, Map<String, dynamic> body) async {
    try {
      final response = await http.patch(
        Uri.parse('$_baseUrl$endpoint'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      );
      return _processResponse(response);
    } catch (e) {
      debugPrint('API PATCH Error: $e');
      rethrow;
    }
  }

  static Future<dynamic> delete(String endpoint) async {
    try {
      final response = await http.delete(Uri.parse('$_baseUrl$endpoint'));
      return _processResponse(response);
    } catch (e) {
      debugPrint('API DELETE Error: $e');
      rethrow;
    }
  }

  static dynamic _processResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    } else {
      throw Exception('API Error (${response.statusCode}): ${response.body}');
    }
  }
}
