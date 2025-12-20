import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../core/services/api_service.dart';
import '../../../models/item_model.dart';

class ItemProvider with ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  List<ItemModel> _items = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<ItemModel> get items => _items;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchItems({bool isAdmin = false}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      Query query = _firestore.collection('items');
      if (!isAdmin) {
        query = query.where('isAvailable', isEqualTo: true);
      }

      final snapshot = await query.get();

      _items = snapshot.docs
          .map((doc) => ItemModel.fromJson(doc.data() as Map<String, dynamic>))
          .toList();
    } catch (e) {
      _errorMessage = e.toString();
      debugPrint('Error fetching items: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteItem(String itemId, {bool isAdminRemoval = false}) async {
    try {
      final endpoint =
          '/items/$itemId${isAdminRemoval ? '?admin_removal=true' : ''}';
      await ApiService.delete(endpoint);
      _items.removeWhere((item) => item.id == itemId);
      notifyListeners();
    } catch (e) {
      debugPrint('Error deleting item via backend: $e');
      rethrow;
    }
  }

  Future<void> addItem(ItemModel item) async {
    _isLoading = true;
    notifyListeners();

    try {
      await ApiService.post('/items', item.toJson());
      _items.add(item);
    } catch (e) {
      debugPrint('Error adding item via backend: $e');
      rethrow;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  List<ItemModel> getUserItems(String userId) {
    return _items.where((item) => item.ownerId == userId).toList();
  }
}
