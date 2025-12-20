import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// import 'features/authentication/screens/login_screen.dart'; // Unused
import 'features/authentication/screens/welcome_screen.dart';
import 'features/home/screens/home_screen.dart';
import 'features/authentication/providers/auth_provider.dart';
// import 'core/widgets/custom_button.dart'; // Unused
// import 'core/constants/app_constants.dart'; // Unused

class App extends StatelessWidget {
  const App({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        return Scaffold(
          body: authProvider.isLoading
              ? const _LoadingScreen()
              : authProvider.user != null
                  ? const HomeScreen()
                  : const WelcomeScreen(),
        );
      },
    );
  }
}

class _LoadingScreen extends StatelessWidget {
  const _LoadingScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).primaryColor,
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.build,
              size: 80,
              color: Colors.white,
            ),
            SizedBox(height: 20),
            CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
            SizedBox(height: 20),
            Text(
              'ToolShare',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              'Building Communities, One Tool at a Time',
              style: TextStyle(
                color: Colors.white70,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
