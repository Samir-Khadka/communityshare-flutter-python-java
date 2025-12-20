import 'package:cloud_firestore/cloud_firestore.dart';

class TransactionModel {
  final String id;
  final String itemId;
  final String borrowerId;
  final String lenderId;
  final DateTime startDate;
  final DateTime endDate;
  final int totalCost;
  final String status; // 'pending', 'approved', 'rejected', 'completed'
  final String itemTitle; // Cached for display
  final String? itemImageUrl; // Cached for display

  TransactionModel({
    required this.id,
    required this.itemId,
    required this.borrowerId,
    required this.lenderId,
    required this.startDate,
    required this.endDate,
    required this.totalCost,
    this.status = 'pending',
    required this.itemTitle,
    this.itemImageUrl,
  });

  factory TransactionModel.fromJson(Map<String, dynamic> json) {
    return TransactionModel(
      id: json['id'] as String,
      itemId: json['itemId'] as String,
      borrowerId: json['borrowerId'] as String,
      lenderId: json['lenderId'] as String,
      startDate: (json['startDate'] as Timestamp).toDate(),
      endDate: (json['endDate'] as Timestamp).toDate(),
      totalCost: json['totalCost'] as int,
      status: json['status'] as String,
      itemTitle: json['itemTitle'] as String,
      itemImageUrl: json['itemImageUrl'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'itemId': itemId,
      'borrowerId': borrowerId,
      'lenderId': lenderId,
      'startDate': Timestamp.fromDate(startDate),
      'endDate': Timestamp.fromDate(endDate),
      'totalCost': totalCost,
      'status': status,
      'itemTitle': itemTitle,
      'itemImageUrl': itemImageUrl,
    };
  }
}
