import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../authentication/providers/auth_provider.dart';
import '../../items/providers/item_provider.dart';
import '../../../models/user_model.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({Key? key}) : super(key: key);

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _refreshData();
    });
  }

  Future<void> _refreshData() async {
    final itemProvider = Provider.of<ItemProvider>(context, listen: false);
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    await Future.wait([
      itemProvider.fetchItems(isAdmin: true),
      authProvider.fetchAllUsers(),
    ]);
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Admin Dashboard'),
          backgroundColor: Colors.orange,
          bottom: const TabBar(
            indicatorColor: Colors.white,
            tabs: [
              Tab(icon: Icon(Icons.people), text: 'Users'),
              Tab(icon: Icon(Icons.build), text: 'Tools'),
            ],
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.info_outline),
              onPressed: () => _showCreditRules(context),
            ),
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: _refreshData,
            ),
          ],
        ),
        body: Consumer2<AuthProvider, ItemProvider>(
          builder: (context, auth, itemProvider, child) {
            if (auth.isLoading || itemProvider.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            return TabBarView(
              children: [
                _buildUserList(auth),
                _buildToolList(itemProvider),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _buildUserList(AuthProvider auth) {
    if (auth.allUsers.isEmpty) {
      return const Center(child: Text('No users found.'));
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: auth.allUsers.length,
      separatorBuilder: (context, index) => const Divider(),
      itemBuilder: (context, index) {
        final user = auth.allUsers[index];
        final isAdmin = user.role == 'admin';

        return ListTile(
          leading: CircleAvatar(
            backgroundImage:
                user.photoUrl != null ? NetworkImage(user.photoUrl!) : null,
            child: user.photoUrl == null
                ? Text(user.displayName?[0] ?? 'U')
                : null,
          ),
          title: Text(user.displayName ?? 'Unknown'),
          subtitle: Text(user.email),
          trailing: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: isAdmin ? Colors.red[50] : Colors.blue[50],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      user.role.toUpperCase(),
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: isAdmin ? Colors.red : Colors.blue,
                      ),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${user.tokens} Tokens',
                    style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.orange),
                  ),
                ],
              ),
              const SizedBox(width: 8),
              PopupMenuButton<String>(
                onSelected: (value) {
                  if (value == 'role') {
                    _toggleUserRole(auth, user.id, user.role);
                  } else if (value == 'delete') {
                    _confirmDeleteUser(context, auth, user);
                  }
                },
                itemBuilder: (context) => [
                  const PopupMenuItem(
                    value: 'role',
                    child: Text('Toggle Role'),
                  ),
                  const PopupMenuItem(
                    value: 'delete',
                    child: Text('Delete User',
                        style: TextStyle(color: Colors.red)),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildToolList(ItemProvider itemProvider) {
    if (itemProvider.items.isEmpty) {
      return const Center(child: Text('No tools found.'));
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: itemProvider.items.length,
      separatorBuilder: (context, index) => const Divider(),
      itemBuilder: (context, index) {
        final item = itemProvider.items[index];
        return ListTile(
          leading: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.network(
              item.imageUrl ?? '',
              width: 50,
              height: 50,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) =>
                  const Icon(Icons.broken_image),
            ),
          ),
          title: Text(item.title),
          subtitle: Text('${item.category} • ${item.ownerId}'),
          trailing: IconButton(
            icon: const Icon(Icons.delete_outline, color: Colors.red),
            onPressed: () => _confirmDelete(context, item.id),
          ),
        );
      },
    );
  }

  Future<void> _toggleUserRole(
      AuthProvider auth, String userId, String currentRole) async {
    final newRole = currentRole == 'admin' ? 'user' : 'admin';
    try {
      await auth.updateUserRole(userId, newRole);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Updated user role to $newRole')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update role: $e')),
        );
      }
    }
  }

  void _confirmDelete(BuildContext context, String itemId) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Delete'),
        content: const Text(
            'Are you sure you want to remove this tool? As an admin, this will also penalize the owner 20 tokens.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              final provider =
                  Provider.of<ItemProvider>(context, listen: false);
              try {
                // Pass isAdminRemoval: true to trigger penalty in backend
                await provider.deleteItem(itemId, isAdminRemoval: true);
                if (context.mounted) Navigator.pop(context);
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text('Tool removed and penalty applied')),
                  );
                }
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Failed to delete: $e')),
                  );
                }
              }
            },
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _showCreditRules(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.info_outline, color: Colors.orange),
            SizedBox(width: 8),
            Text('System Credit Rules'),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('• Welcome Bonus: 5 Tokens',
                style: TextStyle(fontWeight: FontWeight.bold)),
            Text('  (For all new community members)'),
            SizedBox(height: 8),
            Text('• Listing Reward: 10 Tokens',
                style: TextStyle(fontWeight: FontWeight.bold)),
            Text('  (Earned when you list a valid tool)'),
            SizedBox(height: 8),
            Text('• Borrowing Cost: dailyRate',
                style: TextStyle(fontWeight: FontWeight.bold)),
            Text('  (Paid from borrower to owner per day)'),
            SizedBox(height: 8),
            Text('• Admin Removal Penalty: 20 Tokens',
                style:
                    TextStyle(fontWeight: FontWeight.bold, color: Colors.red)),
            Text('  (Deducted if a tool violates rules)'),
            SizedBox(height: 8),
            Text('• Manual Adjustments:',
                style: TextStyle(fontWeight: FontWeight.bold)),
            Text('  (Admins can grant/deduct for community events)'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Got it'),
          ),
        ],
      ),
    );
  }

  void _confirmDeleteUser(
      BuildContext context, AuthProvider auth, UserModel user) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete User'),
        content: Text(
            'Are you sure you want to delete ${user.displayName}? This action is permanent.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              try {
                await auth.deleteUser(user.id);
                if (context.mounted) Navigator.pop(context);
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('User deleted successfully')),
                  );
                }
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Failed to delete user: $e')),
                  );
                }
              }
            },
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}
