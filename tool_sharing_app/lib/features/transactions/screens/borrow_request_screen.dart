import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../authentication/providers/auth_provider.dart';
// import '../../items/providers/item_provider.dart'; // Unused
import '../providers/transaction_provider.dart';
import '../../tokens/providers/token_provider.dart';
import '../../../models/item_model.dart';
import '../../../core/widgets/custom_button.dart';

class BorrowRequestScreen extends StatefulWidget {
  final ItemModel item;

  const BorrowRequestScreen({Key? key, required this.item}) : super(key: key);

  @override
  State<BorrowRequestScreen> createState() => _BorrowRequestScreenState();
}

class _BorrowRequestScreenState extends State<BorrowRequestScreen> {
  DateTimeRange? _selectedDateRange;
  int _totalCost = 0;

  @override
  Widget build(BuildContext context) {
    final isLoading = Provider.of<TransactionProvider>(context).isLoading;

    return Scaffold(
      appBar: AppBar(title: const Text('Request to Borrow')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              widget.item.title,
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),
            Text('Rate: ${widget.item.dailyRate} tokens/day'),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _pickDateRange,
              child: Text(_selectedDateRange == null
                  ? 'Select Dates'
                  : '${_selectedDateRange!.start.toString().split(' ')[0]} - ${_selectedDateRange!.end.toString().split(' ')[0]}'),
            ),
            if (_selectedDateRange != null) ...[
              const SizedBox(height: 16),
              Text(
                'Total Cost: $_totalCost Tokens',
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                textAlign: TextAlign.center,
              ),
            ],
            const Spacer(),
            isLoading
                ? const Center(child: CircularProgressIndicator())
                : CustomButton(
                    text: 'Confirm Request',
                    onPressed:
                        _selectedDateRange == null ? () {} : _handleRequest,
                  ),
          ],
        ),
      ),
    );
  }

  Future<void> _pickDateRange() async {
    final DateTime now = DateTime.now();
    final DateTimeRange? picked = await showDateRangePicker(
      context: context,
      firstDate: now,
      lastDate: now.add(const Duration(days: 90)),
    );

    if (picked != null) {
      setState(() {
        _selectedDateRange = picked;
        final duration =
            picked.end.difference(picked.start).inDays + 1; // Inclusive
        _totalCost = duration * widget.item.dailyRate;
      });
    }
  }

  Future<void> _handleRequest() async {
    final user = Provider.of<AuthProvider>(context, listen: false).user;
    if (user == null || _selectedDateRange == null) return;

    final tokenProvider = Provider.of<TokenProvider>(context, listen: false);
    final hasTokens = await tokenProvider.hasEnoughTokens(user.uid, _totalCost);

    if (!hasTokens) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Insufficient tokens!')),
        );
      }
      return;
    }

    try {
      if (!mounted) return;

      await Provider.of<TransactionProvider>(context, listen: false)
          .createRequest(
        item: widget.item,
        borrowerId: user.uid,
        startDate: _selectedDateRange!.start,
        endDate: _selectedDateRange!.end,
        totalCost: _totalCost,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Request sent successfully!')),
        );
        Navigator.pop(context);
        // Optionally navigate to transactions list
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }
}
