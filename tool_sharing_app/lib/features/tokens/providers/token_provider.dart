import 'package:flutter/material.dart';
import '../../../core/services/api_service.dart';

class TokenProvider with ChangeNotifier {
  Future<bool> hasEnoughTokens(String userId, int cost) async {
    try {
      final data = await ApiService.get('/transactions/balance/$userId');
      final currentTokens = data['availableBalance'] as num? ?? 0;
      return currentTokens >= cost;
    } catch (e) {
      debugPrint('Error checking tokens via backend: $e');
      return false;
    }
  }

  Future<void> deductTokens(String userId, int cost) async {
    try {
      await ApiService.post('/transactions/process', {
        'userId': userId,
        'amount': cost,
        'transactionType': 'BORROW',
        'description': 'Token deduction for item rental'
      });
      notifyListeners();
    } catch (e) {
      debugPrint('Error deducting tokens via backend: $e');
      rethrow;
    }
  }

  Future<void> addTokens(String userId, int amount) async {
    try {
      await ApiService.post('/transactions/process', {
        'userId': userId,
        'amount': amount,
        'transactionType': 'LEND',
        'description': 'Token reward for item lending'
      });
      notifyListeners();
    } catch (e) {
      debugPrint('Error adding tokens via backend: $e');
      rethrow;
    }
  }
}
