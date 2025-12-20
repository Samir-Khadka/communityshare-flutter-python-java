class UserModel {
  final String id;
  final String email;
  final String? displayName;
  final String? photoUrl;
  final int tokens;
  final double rating;
  final String role;

  UserModel({
    required this.id,
    required this.email,
    this.displayName,
    this.photoUrl,
    this.tokens = 0,
    this.rating = 0.0,
    this.role = 'user',
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      email: json['email'] as String,
      displayName: json['displayName'] as String?,
      photoUrl: json['photoUrl'] as String?,
      tokens: (json['tokens'] as num?)?.toInt() ?? 0,
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      role: json['role'] as String? ?? 'user',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'displayName': displayName,
      'photoUrl': photoUrl,
      'tokens': tokens,
      'rating': rating,
      'role': role,
    };
  }
}
