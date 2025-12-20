# Flutter App Structure

```
tool_sharing_app/
├── lib/
│   ├── main.dart
│   ├── app.dart
│   ├── core/
│   │   ├── constants/
│   │   │   ├── app_constants.dart
│   │   │   ├── api_constants.dart
│   │   │   └── theme_constants.dart
│   │   ├── utils/
│   │   │   ├── api_helper.dart
│   │   │   ├── date_utils.dart
│   │   │   ├── image_utils.dart
│   │   │   └── validation_utils.dart
│   │   ├── services/
│   │   │   ├── auth_service.dart
│   │   │   ├── firebase_service.dart
│   │   │   ├── storage_service.dart
│   │   │   └── notification_service.dart
│   │   └── widgets/
│   │       ├── custom_button.dart
│   │       ├── custom_text_field.dart
│   │       ├── loading_widget.dart
│   │       ├── item_card.dart
│   │       └── user_avatar.dart
│   ├── features/
│   │   ├── authentication/
│   │   │   ├── screens/
│   │   │   │   ├── login_screen.dart
│   │   │   │   ├── register_screen.dart
│   │   │   │   └── forgot_password_screen.dart
│   │   │   ├── widgets/
│   │   │   │   ├── auth_form.dart
│   │   │   │   └── social_login_buttons.dart
│   │   │   └── providers/
│   │   │       └── auth_provider.dart
│   │   ├── home/
│   │   │   ├── screens/
│   │   │   │   ├── home_screen.dart
│   │   │   │   ├── search_screen.dart
│   │   │   │   └── profile_screen.dart
│   │   │   ├── widgets/
│   │   │   │   ├── search_bar.dart
│   │   │   │   ├── category_filter.dart
│   │   │   │   └── item_list.dart
│   │   │   └── providers/
│   │   │       └── home_provider.dart
│   │   ├── items/
│   │   │   ├── screens/
│   │   │   │   ├── item_detail_screen.dart
│   │   │   │   ├── add_item_screen.dart
│   │   │   │   └── my_items_screen.dart
│   │   │   ├── widgets/
│   │   │   │   ├── item_form.dart
│   │   │   │   ├── image_picker_widget.dart
│   │   │   │   └── availability_calendar.dart
│   │   │   └── providers/
│   │   │       └── item_provider.dart
│   │   ├── transactions/
│   │   │   ├── screens/
│   │   │   │   ├── transaction_list_screen.dart
│   │   │   │   ├── transaction_detail_screen.dart
│   │   │   │   └── borrow_request_screen.dart
│   │   │   ├── widgets/
│   │   │   │   ├── transaction_card.dart
│   │   │   │   ├── status_badge.dart
│   │   │   │   └── review_dialog.dart
│   │   │   └── providers/
│   │   │       └── transaction_provider.dart
│   │   ├── messaging/
│   │   │   ├── screens/
│   │   │   │   ├── chat_list_screen.dart
│   │   │   │   └── chat_screen.dart
│   │   │   ├── widgets/
│   │   │   │   ├── message_bubble.dart
│   │   │   │   ├── message_input.dart
│   │   │   │   └── chat_header.dart
│   │   │   └── providers/
│   │   │       └── chat_provider.dart
│   │   ├── tokens/
│   │   │   ├── screens/
│   │   │   │   ├── token_balance_screen.dart
│   │   │   │   ├── token_history_screen.dart
│   │   │   │   └── earn_tokens_screen.dart
│   │   │   ├── widgets/
│   │   │   │   ├── token_balance_card.dart
│   │   │   │   ├── transaction_history_item.dart
│   │   │   │   └── earning_opportunity_card.dart
│   │   │   └── providers/
│   │   │       └── token_provider.dart
│   │   └── location/
│   │       ├── screens/
│   │       │   ├── location_permission_screen.dart
│   │       │   └── map_screen.dart
│   │       ├── widgets/
│   │       │   ├── location_picker.dart
│   │       │   └── distance_calculator.dart
│   │       └── providers/
│   │           └── location_provider.dart
│   ├── models/
│   │   ├── user_model.dart
│   │   ├── item_model.dart
│   │   ├── transaction_model.dart
│   │   ├── message_model.dart
│   │   ├── review_model.dart
│   │   └── token_model.dart
│   ├── providers/
│   │   ├── theme_provider.dart
│   │   ├── locale_provider.dart
│   │   └── connectivity_provider.dart
│   └── routes/
│       ├── app_routes.dart
│       └── route_generator.dart
├── assets/
│   ├── images/
│   │   ├── logo.png
│   │   ├── placeholder.png
│   │   └── illustrations/
│   ├── icons/
│   └── fonts/
├── test/
│   ├── unit/
│   ├── widget/
│   └── integration/
├── android/
├── ios/
├── pubspec.yaml
├── README.md
└── analysis_options.yaml
```