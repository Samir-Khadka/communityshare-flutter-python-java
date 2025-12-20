class ItemModel {
  final String id;
  final String ownerId;
  final String title;
  final String description;
  final String category;
  final String? imageUrl;
  final int dailyRate;
  final bool isAvailable;

  ItemModel({
    required this.id,
    required this.ownerId,
    required this.title,
    required this.description,
    required this.category,
    this.imageUrl,
    required this.dailyRate,
    this.isAvailable = true,
  });

  factory ItemModel.fromJson(Map<String, dynamic> json) {
    return ItemModel(
      id: json['id'] as String,
      ownerId: json['ownerId'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      category: json['category'] as String,
      imageUrl: json['imageUrl'] as String?,
      dailyRate: json['dailyRate'] as int? ?? 0,
      isAvailable: json['isAvailable'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'ownerId': ownerId,
      'title': title,
      'description': description,
      'category': category,
      'imageUrl': imageUrl,
      'dailyRate': dailyRate,
      'isAvailable': isAvailable,
    };
  }
}