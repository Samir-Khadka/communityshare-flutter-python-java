import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
// import 'package:uuid/uuid.dart'; // We need to add uuid to pubspec
import '../../../models/item_model.dart';
import '../../authentication/providers/auth_provider.dart';
import '../../items/providers/item_provider.dart';
import '../../../core/widgets/custom_button.dart';
// import '../../../core/widgets/custom_text_field.dart'; // Ensure this exists or use TextFormField

class AddItemScreen extends StatefulWidget {
  const AddItemScreen({Key? key}) : super(key: key);

  @override
  State<AddItemScreen> createState() => _AddItemScreenState();
}

class _AddItemScreenState extends State<AddItemScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _rateController = TextEditingController();
  String _selectedCategory = 'Tools';

  final List<String> _categories = [
    'Tools',
    'Gardening',
    'Electronics',
    'Camping',
    'Sports',
    'Other',
  ];

  @override
  Widget build(BuildContext context) {
    final isLoading = Provider.of<ItemProvider>(context).isLoading;

    return Scaffold(
      appBar: AppBar(
        title: const Text('List Valid Item'),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () => _showCreditRules(context),
            tooltip: 'Credit Rules',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Container(
                margin: const EdgeInsets.only(bottom: 24),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.green[50],
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.green[100]!),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.stars, color: Colors.green),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Listing Reward: 10 Tokens will be added to your balance upon successful listing!',
                        style: TextStyle(
                            color: Colors.green[800],
                            fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ),
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'Item Title',
                  border: OutlineInputBorder(),
                ),
                validator: (v) => v!.isEmpty ? 'Title is required' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _selectedCategory,
                decoration: const InputDecoration(
                  labelText: 'Category',
                  border: OutlineInputBorder(),
                ),
                items: _categories
                    .map((c) => DropdownMenuItem(
                          value: c,
                          child: Text(c),
                        ))
                    .toList(),
                onChanged: (v) => setState(() => _selectedCategory = v!),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(
                  labelText: 'Description',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
                validator: (v) => v!.isEmpty ? 'Description is required' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _rateController,
                decoration: const InputDecoration(
                  labelText: 'Daily Rate (Tokens)',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                validator: (v) {
                  if (v == null || v.isEmpty) return 'Rate is required';
                  if (int.tryParse(v) == null) return 'Must be a number';
                  return null;
                },
              ),
              const SizedBox(height: 24),
              isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : CustomButton(
                      text: 'List Item',
                      onPressed: _handleSubmit,
                    ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _handleSubmit() async {
    if (_formKey.currentState!.validate()) {
      final user = Provider.of<AuthProvider>(context, listen: false).user;
      if (user == null) return;

      final newItem = ItemModel(
        id: DateTime.now()
            .millisecondsSinceEpoch
            .toString(), // Simple ID generation
        ownerId: user.uid,
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        category: _selectedCategory,
        dailyRate: int.parse(_rateController.text),
        isAvailable: true,
      );

      try {
        await Provider.of<ItemProvider>(context, listen: false)
            .addItem(newItem);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Item listed successfully!')),
          );
          Navigator.pop(context);
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
}
