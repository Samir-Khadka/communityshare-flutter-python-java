import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:uuid/uuid.dart';
import '../../../models/transaction_model.dart';
import '../../../models/item_model.dart';

class TransactionProvider with ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  List<TransactionModel> _transactions = [];
  bool _isLoading = false;
  
  List<TransactionModel> get transactions => _transactions;
  bool get isLoading => _isLoading;
  
  Future<void> createRequest({
    required ItemModel item,
    required String borrowerId,
    required DateTime startDate,
    required DateTime endDate,
    required int totalCost,
  }) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final id = const Uuid().v4();
      final transaction = TransactionModel(
        id: id,
        itemId: item.id,
        borrowerId: borrowerId,
        lenderId: item.ownerId,
        startDate: startDate,
        endDate: endDate,
        totalCost: totalCost,
        status: 'pending',
        itemTitle: item.title,
        itemImageUrl: item.imageUrl,
      );
      
      await _firestore.collection('transactions').doc(id).set(transaction.toJson());
      _transactions.insert(0, transaction);
      
      // Deduct tokens from borrower (ESCROW)
      // Note: Ideally we should use a batch write or transaction
      await _firestore.collection('users').doc(borrowerId).update({
        'tokens': FieldValue.increment(-totalCost),
      });
      
    } catch (e) {
      debugPrint('Error creating request: $e');
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  Future<void> fetchUserTransactions(String userId) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      // Simple query: fetch where user is borrower OR lender
      // Firestore doesn't support logical OR directly in where clauses easily for different fields
      // So we might need two queries or a composite field. 
      // For MVP, letting's fetch where borrower == id and lender == id separately
      
      final borrowed = await _firestore.collection('transactions')
          .where('borrowerId', isEqualTo: userId)
          .orderBy('startDate', descending: true)
          .get();
          
      final lent = await _firestore.collection('transactions')
          .where('lenderId', isEqualTo: userId)
          .orderBy('startDate', descending: true)
          .get();
          
      final allDocs = [...borrowed.docs, ...lent.docs];
      // remove duplicates if any (unlikely with this logic)
      
      _transactions = allDocs
          .map((doc) => TransactionModel.fromJson(doc.data()))
          .toList();
          
      // Sort in memory just in case
      _transactions.sort((a, b) => b.startDate.compareTo(a.startDate));
      
    } catch (e) {
      debugPrint('Error fetching transactions: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateStatus(String transactionId, String newStatus) async {
    await _firestore.collection('transactions').doc(transactionId).update({
      'status': newStatus,
    });
    
    final index = _transactions.indexWhere((t) => t.id == transactionId);
    if (index != -1) {
      // Locally update
      // We can't modify the object since it's final, replace it
      // Simple fetch again or simple UI update logic
      // For now, let's fetch again or trust the listener update if using stream
      // Just re-fetch for simplicity
      // await fetchUserTransactions(currentUserId); 
    }
    notifyListeners();
  }
}

