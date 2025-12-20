import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../authentication/providers/auth_provider.dart';
import '../providers/transaction_provider.dart';
import '../../../models/transaction_model.dart';

class TransactionListScreen extends StatefulWidget {
  const TransactionListScreen({Key? key}) : super(key: key);

  @override
  State<TransactionListScreen> createState() => _TransactionListScreenState();
}

class _TransactionListScreenState extends State<TransactionListScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final user = Provider.of<AuthProvider>(context, listen: false).user;
      if (user != null) {
        Provider.of<TransactionProvider>(context, listen: false).fetchUserTransactions(user.uid);
      }
    });
  }
  
  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Transactions'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Borrowed'),
            Tab(text: 'Lent'),
          ],
        ),
      ),
      body: Consumer<TransactionProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          
          final user = Provider.of<AuthProvider>(context, listen: false).user;
          if (user == null) return const Center(child: Text('Please login'));

          final borrowed = provider.transactions.where((t) => t.borrowerId == user.uid).toList();
          final lent = provider.transactions.where((t) => t.lenderId == user.uid).toList();

          return TabBarView(
            controller: _tabController,
            children: [
              _buildList(borrowed, isLender: false),
              _buildList(lent, isLender: true),
            ],
          );
        },
      ),
    );
  }

  Widget _buildList(List<TransactionModel> transactions, {required bool isLender}) {
    if (transactions.isEmpty) {
      return const Center(child: Text('No transactions found'));
    }

    return ListView.builder(
      itemCount: transactions.length,
      itemBuilder: (context, index) {
        final t = transactions[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: ListTile(
            title: Text(t.itemTitle),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Status: ${t.status.toUpperCase()}'),
                Text('${DateFormat.MMMd().format(t.startDate)} - ${DateFormat.MMMd().format(t.endDate)}'),
                Text('Cost: ${t.totalCost} Tokens'),
              ],
            ),
            trailing: isLender && t.status == 'pending'
                ? Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.check, color: Colors.green),
                        onPressed: () => _updateStatus(t.id, 'approved'),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.red),
                        onPressed: () => _updateStatus(t.id, 'rejected'),
                      ),
                    ],
                  )
                : null,
          ),
        );
      },
    );
  }
  
  void _updateStatus(String id, String status) {
    Provider.of<TransactionProvider>(context, listen: false).updateStatus(id, status);
  }
}
