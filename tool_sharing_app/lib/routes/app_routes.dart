import 'package:flutter/material.dart';
import '../features/authentication/screens/login_screen.dart';
import '../features/home/screens/home_screen.dart';
import '../features/authentication/screens/register_screen.dart';
import '../features/authentication/screens/forgot_password_screen.dart';
import '../features/items/screens/add_item_screen.dart';
import '../features/items/screens/item_detail_screen.dart';
import '../features/transactions/screens/borrow_request_screen.dart';
import '../features/transactions/screens/transaction_list_screen.dart';
import '../features/profile/screens/profile_screen.dart';
import '../features/profile/screens/edit_profile_screen.dart';
import '../features/admin/screens/admin_dashboard_screen.dart';
import '../models/item_model.dart';

class AppRoutes {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case '/login':
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case '/register':
        return MaterialPageRoute(builder: (_) => const RegisterScreen());
      case '/forgot-password':
        return MaterialPageRoute(builder: (_) => const ForgotPasswordScreen());
      case '/add-item':
        return MaterialPageRoute(builder: (_) => const AddItemScreen());
      case '/item-detail':
        final item = settings.arguments as ItemModel;
        return MaterialPageRoute(builder: (_) => ItemDetailScreen(item: item));
      case '/borrow-request':
        final item = settings.arguments as ItemModel;
        return MaterialPageRoute(
            builder: (_) => BorrowRequestScreen(item: item));
      case '/transactions':
        return MaterialPageRoute(builder: (_) => const TransactionListScreen());
      case '/profile':
        return MaterialPageRoute(builder: (_) => const ProfileScreen());
      case '/edit-profile':
        return MaterialPageRoute(builder: (_) => const EditProfileScreen());
      case '/admin':
        return MaterialPageRoute(builder: (_) => const AdminDashboardScreen());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(child: Text('No route defined for ${settings.name}')),
          ),
        );
    }
  }
}
