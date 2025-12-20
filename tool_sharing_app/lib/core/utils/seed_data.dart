import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../../models/user_model.dart';
import '../../models/item_model.dart';
import 'package:uuid/uuid.dart';
import 'dart:math';

class SeedData {
  static final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  static const _uuid = Uuid();
  static final _random = Random();

  static final List<String> _firstNames = [
    'James',
    'Mary',
    'Robert',
    'Patricia',
    'John',
    'Jennifer',
    'Michael',
    'Linda',
    'William',
    'Elizabeth',
    'David',
    'Barbara',
    'Richard',
    'Susan',
    'Joseph',
    'Jessica',
    'Thomas',
    'Sarah',
    'Charles',
    'Karen',
    'Christopher',
    'Nancy',
    'Daniel',
    'Lisa',
    'Matthew',
    'Betty',
    'Anthony',
    'Margaret',
    'Mark',
    'Sandra',
    'Donald',
    'Ashley'
  ];

  static final List<String> _lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzales',
    'Wilson',
    'Anderson',
    'Thomas'
  ];

  static final Map<String, List<String>> _toolsByCategory = {
    'Tools': [
      'Power Drill',
      'Hammer Drill',
      'Circular Saw',
      'Jigsaw',
      'Angle Grinder',
      'Socket Set',
      'Torque Wrench',
      'Pipe Wrench',
      'Soldering Iron',
      'Heat Gun',
      'Step Ladder',
      'Extension Ladder',
      'Digital Multimeter',
      'Laser Level'
    ],
    'Gardening': [
      'Lawn Mower',
      'Hedge Trimmer',
      'Leaf Blower',
      'Pressure Washer',
      'Chainsaw',
      'String Trimmer',
      'Garden Tiller',
      'Pruning Shears',
      'Wheelbarrow',
      'Post Hole Digger'
    ],
    'Electronics': [
      'Digital Projector',
      'PA System',
      'Microphone Set',
      'DSLR Camera',
      'Camera Tripod',
      'Video Camera',
      'VR Headset',
      'Power Station',
      'DJ Controller',
      'Studio Monitor'
    ],
    'Camping': [
      '6-Person Tent',
      'Portable Stove',
      'Cooler Box',
      'Sleeping Bag Set',
      'Camping Lantern',
      'Portable Heater',
      'Air Mattress Pump',
      'Solar Charger',
      'Camping Table',
      'Hiking Pack'
    ],
    'Sports': [
      'Tennis Ball Machine',
      'Basketball Hoop',
      'Table Tennis Table',
      'Bicycle Rack',
      'Kayak',
      'Paddle Board',
      'Golf Club Set',
      'Boxing Bag',
      'Yoga Mat Set',
      'Badminton Set'
    ],
    'Other': [
      'Sewing Machine',
      'Guitar',
      'Keyboard',
      'Board Game Collection',
      'Folding Chairs',
      'Party Gazebo',
      'Steam Cleaner',
      'Induction Cooker',
      'Kitchen Mixer',
      'Ice Cream Maker'
    ]
  };

  static final Map<String, String> _categoryImages = {
    'Tools':
        'https://images.unsplash.com/photo-1530124560676-5f96e4524c16?auto=format&fit=crop&w=800&q=80', // Toolbox
    'Gardening':
        'https://images.unsplash.com/photo-1416870213989-055a164c0371?auto=format&fit=crop&w=800&q=80', // Garden
    'Electronics':
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', // Electronics
    'Camping':
        'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80', // Camping Tent
    'Sports':
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80', // Sports
    'Other':
        'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80', // Kitchen tools
  };

  static Future<void> seedDatabase() async {
    try {
      final List<UserModel> users = [];
      final List<ItemModel> items = [];

      // 1. Generate 45 Users
      for (int i = 0; i < 45; i++) {
        final firstName = _firstNames[_random.nextInt(_firstNames.length)];
        final lastName = _lastNames[_random.nextInt(_lastNames.length)];
        final displayName = '$firstName $lastName';
        final email =
            '${firstName.toLowerCase()}.${lastName.toLowerCase()}${_random.nextInt(100)}@example.com';
        final uid = _uuid.v4();

        users.add(UserModel(
          id: uid,
          email: email,
          displayName: displayName,
          photoUrl: 'https://i.pravatar.cc/150?u=$uid',
          tokens: 100 + _random.nextInt(900),
          rating: 4.0 + (_random.nextDouble() * 1.0),
        ));
      }

      // 2. Save Users to Firestore (using batch)
      var batch = _firestore.batch();
      for (int i = 0; i < users.length; i++) {
        final userDoc = _firestore.collection('users').doc(users[i].id);
        batch.set(userDoc, users[i].toJson());

        // Firestore batch limit is 500 operations
        if ((i + 1) % 400 == 0) {
          await batch.commit();
          batch = _firestore.batch();
        }
      }
      await batch.commit();

      // 3. Generate 65 Items
      final categories = _toolsByCategory.keys.toList();
      for (int i = 0; i < 65; i++) {
        final category = categories[_random.nextInt(categories.length)];
        final toolList = _toolsByCategory[category]!;
        final toolName = toolList[_random.nextInt(toolList.length)];
        final owner = users[_random.nextInt(users.length)];

        items.add(ItemModel(
          id: _uuid.v4(),
          ownerId: owner.id,
          title: toolName,
          description:
              'A high-quality $toolName in excellent condition. Perfect for your needs.',
          category: category,
          dailyRate: 5 + _random.nextInt(45),
          isAvailable: true,
          imageUrl: _categoryImages[category],
        ));
      }

      // 4. Save Items to Firestore
      batch = _firestore.batch();
      for (int i = 0; i < items.length; i++) {
        final itemDoc = _firestore.collection('items').doc(items[i].id);
        batch.set(itemDoc, items[i].toJson());

        if ((i + 1) % 400 == 0) {
          await batch.commit();
          batch = _firestore.batch();
        }
      }
      await batch.commit();

      debugPrint('Successfully seeded 45 users and 65 items!');
    } catch (e) {
      debugPrint('Error seeding database: $e');
      rethrow;
    }
  }
}
