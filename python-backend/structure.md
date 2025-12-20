# Python Backend Structure

```
python-backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── database.py
│   │   └── firebase_config.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── item.py
│   │   ├── transaction.py
│   │   ├── message.py
│   │   ├── review.py
│   │   └── token.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── user_schema.py
│   │   ├── item_schema.py
│   │   ├── transaction_schema.py
│   │   ├── message_schema.py
│   │   ├── review_schema.py
│   │   └── token_schema.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── dependencies.py
│   │   ├── middleware.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── items.py
│   │       ├── transactions.py
│   │       ├── messages.py
│   │       ├── reviews.py
│   │       ├── notifications.py
│   │       ├── search.py
│   │       └── location.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── item_service.py
│   │   ├── transaction_service.py
│   │   ├── message_service.py
│   │   ├── review_service.py
│   │   ├── notification_service.py
│   │   ├── search_service.py
│   │   ├── location_service.py
│   │   ├── image_service.py
│   │   └── token_service.py
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── security.py
│   │   ├── validators.py
│   │   ├── helpers.py
│   │   ├── exceptions.py
│   │   ├── logger.py
│   │   └── email_utils.py
│   └── core/
│       ├── __init__.py
│       ├── database.py
│       ├── security.py
│       ├── firebase.py
│       └── java_client.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_users.py
│   ├── test_items.py
│   ├── test_transactions.py
│   ├── test_messages.py
│   ├── test_reviews.py
│   └── test_services/
│       ├── test_auth_service.py
│       ├── test_user_service.py
│       ├── test_item_service.py
│       └── test_transaction_service.py
├── migrations/
├── scripts/
│   ├── init_db.py
│   ├── seed_data.py
│   └── backup_db.py
├── docs/
│   ├── api_documentation.md
│   ├── deployment_guide.md
│   └── development_setup.md
├── requirements.txt
├── requirements-dev.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```