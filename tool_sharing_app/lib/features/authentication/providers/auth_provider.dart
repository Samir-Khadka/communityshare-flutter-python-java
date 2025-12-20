import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../../../models/user_model.dart';
import '../../../../core/services/auth_service.dart';
import '../../../../core/services/api_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  User? _user;
  UserModel? _userModel;
  List<UserModel> _allUsers = [];
  bool _isLoading = false;

  User? get user => _user;
  UserModel? get userModel => _userModel;
  List<UserModel> get allUsers => _allUsers;
  bool get isLoading => _isLoading;

  AuthProvider() {
    _authService.authStateChanges.listen((User? user) async {
      _user = user;
      if (user != null) {
        await refreshUser();
      } else {
        _userModel = null;
      }
      notifyListeners();
    });
  }

  Future<void> refreshUser() async {
    if (_user == null) return;
    try {
      final doc = await _firestore.collection('users').doc(_user!.uid).get();
      if (doc.exists) {
        _userModel = UserModel.fromJson(doc.data()!);

        // Lazy Admin Promotion for ram123@gmail.com
        if (_userModel!.email == 'ram123@gmail.com' &&
            _userModel!.role != 'admin') {
          await _firestore
              .collection('users')
              .doc(_user!.uid)
              .update({'role': 'admin'});
          await refreshUser();
          return;
        }
      } else {
        // Create user if missing (Silent Registration)
        final isRam = _user!.email == 'ram123@gmail.com';
        _userModel = UserModel(
          id: _user!.uid,
          email: _user!.email!,
          displayName: _user!.displayName ?? _user!.email!.split('@')[0],
          role: isRam ? 'admin' : 'user',
          tokens: isRam ? 100 : 5,
        );
        await _firestore
            .collection('users')
            .doc(_user!.uid)
            .set(_userModel!.toJson());
      }
      notifyListeners();
    } catch (e) {
      debugPrint('Error refreshing user: $e');
    }
  }

  Future<void> signIn(String email, String password) async {
    _isLoading = true;
    notifyListeners();
    try {
      await _authService.signIn(email, password);
      await refreshUser();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> signUp(String email, String password, String displayName) async {
    _isLoading = true;
    notifyListeners();
    try {
      final credential = await _authService.signUp(email, password);
      if (credential?.user != null) {
        final newUser = UserModel(
          id: credential!.user!.uid,
          email: email,
          displayName: displayName,
        );

        await _firestore
            .collection('users')
            .doc(credential.user!.uid)
            .set(newUser.toJson());

        await credential.user!.updateDisplayName(displayName);
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchAllUsers() async {
    _isLoading = true;
    notifyListeners();
    try {
      final List<dynamic> data = await ApiService.get('/users');
      _allUsers = data.map((json) => UserModel.fromJson(json)).toList();
    } catch (e) {
      debugPrint('Error fetching all users via backend: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateUserRole(String userId, String newRole) async {
    try {
      await ApiService.patch('/users/$userId/role?role=$newRole', {});
      final index = _allUsers.indexWhere((u) => u.id == userId);
      if (index != -1) {
        final u = _allUsers[index];
        _allUsers[index] = UserModel(
          id: u.id,
          email: u.email,
          displayName: u.displayName,
          photoUrl: u.photoUrl,
          tokens: u.tokens,
          rating: u.rating,
          role: newRole,
        );
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error updating user role via backend: $e');
      rethrow;
    }
  }

  Future<void> deleteUser(String userId) async {
    try {
      await ApiService.delete('/users/$userId');
      _allUsers.removeWhere((u) => u.id == userId);
      notifyListeners();
    } catch (e) {
      debugPrint('Error deleting user via backend: $e');
      rethrow;
    }
  }

  Future<void> transformUser(String uid) async {
    // Placeholder for any future logic needing user transformation
  }

  Future<void> signOut() async {
    await _authService.signOut();
  }

  Future<void> resetPassword(String email) async {
    await FirebaseAuth.instance.sendPasswordResetEmail(email: email);
  }
}
