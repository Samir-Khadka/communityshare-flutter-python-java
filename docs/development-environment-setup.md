# Development Environment Setup Guide

## Overview

This guide provides step-by-step instructions for setting up the complete development environment for the ToolShare platform, including Flutter mobile app, Python backend, Java token system, and supporting services.

## Prerequisites

### System Requirements
- **Operating System**: Windows 10/11, macOS 10.14+, or Ubuntu 18.04+
- **RAM**: Minimum 8GB, recommended 16GB
- **Storage**: Minimum 50GB free space
- **Internet**: Stable broadband connection

### Required Software
- **Git**: Version 2.25 or higher
- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 1.29 or higher
- **Node.js**: Version 16.x or higher
- **Java JDK**: Version 11 or higher (for Java token system)
- **Python**: Version 3.9 or higher
- **Flutter SDK**: Version 3.16 or higher

## 1. Flutter Mobile App Setup

### 1.1 Install Flutter SDK

#### Windows
```bash
# Download Flutter SDK from https://flutter.dev/docs/get-started/install/windows
# Extract to C:\flutter
# Add C:\flutter\bin to PATH
flutter doctor
```

#### macOS
```bash
# Install using Homebrew
brew install --cask flutter

# Or download manually
# Extract to ~/development/flutter
# Add to PATH in ~/.zshrc or ~/.bash_profile
export PATH="$PATH:$HOME/development/flutter/bin"

flutter doctor
```

#### Linux
```bash
# Download Flutter SDK
wget https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.16.0-stable.tar.xz

# Extract
tar xf flutter_linux_3.16.0-stable.tar.xz
export PATH="$PATH:`pwd`/flutter/bin"

# Add to ~/.bashrc permanently
echo 'export PATH="$PATH:/opt/flutter/bin"' >> ~/.bashrc

flutter doctor
```

### 1.2 Set Up IDE

#### VS Code (Recommended)
```bash
# Install VS Code
# Install Flutter extension
code --install-extension Dart-Code.flutter

# Install additional extensions
code --install-extension Dart-Code.dart-code
code --install-extension ms-vscode.vscode-json
code --install-extension bradlc.vscode-tailwindcss
```

#### Android Studio
```bash
# Download and install Android Studio
# Install Flutter plugin
# Configure Android SDK
flutter config --android-studio-dir /path/to/android-studio
```

### 1.3 Configure Mobile Development

#### Android Setup
```bash
# Accept Android licenses
flutter doctor --android-licenses

# Set up Android device or emulator
flutter devices
```

#### iOS Setup (macOS only)
```bash
# Install Xcode from App Store
# Install Xcode command line tools
xcode-select --install

# Install CocoaPods
sudo gem install cocoapods

# Set up iOS Simulator
flutter devices
```

### 1.4 Create Flutter Project
```bash
# Create new Flutter project
flutter create toolshare_app
cd toolshare_app

# Install dependencies
flutter pub get

# Run the app
flutter run
```

### 1.5 Configure Firebase for Flutter

#### 1.5.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: "toolshare-app"
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Enable Cloud Storage
6. Enable Cloud Functions

#### 1.5.2 Add Firebase to Flutter
```bash
# Add FlutterFire dependencies
flutter pub add firebase_core
flutter pub add firebase_auth
flutter pub add cloud_firestore
flutter pub add firebase_storage
flutter pub add firebase_messaging
flutter pub add firebase_analytics

# Download google-services.json (Android) and GoogleService-Info.plist (iOS)
# Place in appropriate directories:
# android/app/google-services.json
# ios/Runner/GoogleService-Info.plist
```

#### 1.5.3 Initialize Firebase in Flutter
```dart
// lib/main.dart
import 'package:firebase_core/firebase_core.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}
```

## 2. Python Backend Setup

### 2.1 Install Python and Virtual Environment

#### Windows
```bash
# Download Python from python.org
# Install with "Add to PATH" option checked

# Create virtual environment
python -m venv toolshare-backend
cd toolshare-backend
source venv/Scripts/activate
```

#### macOS/Linux
```bash
# Install Python 3.9+
brew install python@3.9

# Create virtual environment
python3.9 -m venv toolshare-backend
cd toolshare-backend
source venv/bin/activate
```

### 2.2 Set Up Python Project

```bash
# Clone or create project structure
git clone <repository-url> toolshare-backend
cd toolshare-backend

# Install dependencies
pip install -r requirements.txt

# Install development dependencies
pip install -r requirements-dev.txt
```

### 2.3 Requirements.txt
```txt
# Core Framework
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0

# Database
sqlalchemy==2.0.23
alembic==1.13.0
psycopg2-binary==2.9.9
redis==5.0.1

# Firebase
firebase-admin==6.2.0
google-cloud-storage==2.10.0
google-cloud-firestore==2.13.1

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6

# HTTP Client
httpx==0.25.2
aiohttp==3.9.1

# Image Processing
pillow==10.1.0
python-magic==0.4.27

# Email
aiosmtplib==3.0.1
jinja2==3.1.2

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2

# Development
black==23.11.0
flake8==6.1.0
mypy==1.7.1
pre-commit==3.6.0
```

### 2.4 Environment Configuration

Create `.env` file:
```bash
# App Settings
APP_NAME=ToolShare API
DEBUG=True
HOST=0.0.0.0
PORT=8000

# Security
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/toolshare

# Firebase
FIREBASE_PROJECT_ID=toolshare-app
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@toolshare-app.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id

# Java Token Service
JAVA_TOKEN_SERVICE_URL=http://localhost:8080

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@toolshare.app

# External APIs
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
STRIPE_SECRET_KEY=sk_test_your-stripe-key
```

### 2.5 Database Setup

#### PostgreSQL Installation
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download and install from postgresql.org
```

#### Database Creation
```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE toolshare;
CREATE USER toolshare_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE toolshare TO toolshare_user;
\q

# Run migrations
python -m alembic upgrade head
```

### 2.6 Redis Setup
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu
sudo apt-get install redis-server
sudo systemctl start redis

# Windows
# Download Redis for Windows and start redis-server.exe
```

### 2.7 Run Python Backend
```bash
# Activate virtual environment
source venv/bin/activate  # Linux/macOS
# or
source venv/Scripts/activate  # Windows

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or run with specific config
uvicorn app.main:app --reload --env-file .env.dev
```

## 3. Java Token System Setup

### 3.1 Install Java Development Kit

#### Windows
```bash
# Download OpenJDK 11 from Adoptium
# Install and set JAVA_HOME
setx JAVA_HOME "C:\Program Files\Java\jdk-11"
setx PATH "%PATH%;%JAVA_HOME%\bin"
```

#### macOS
```bash
# Install using Homebrew
brew install openjdk@11

# Set JAVA_HOME
echo 'export JAVA_HOME="/usr/local/opt/openjdk@11"' >> ~/.zshrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install openjdk-11-jdk

# Set JAVA_HOME
echo 'export JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64"' >> ~/.bashrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 3.2 Install Maven

```bash
# Windows
# Download Apache Maven and extract
# Add to PATH

# macOS
brew install maven

# Linux
sudo apt-get install maven
```

### 3.3 Create Java Project

```bash
# Create Spring Boot project using Spring Initializr
# https://start.spring.io/

# Project Configuration:
# - Project: Maven
# - Language: Java
# - Spring Boot: 3.1.x
# - Group: com.toolshare
# - Artifact: token-system
# - Name: token-system
# - Package: com.toolshare.tokens
# - Dependencies: Spring Web, Spring Data JPA, Spring Security, Redis, Validation

# Or clone existing project
git clone <repository-url> token-system
cd token-system
```

### 3.4 Project Structure
```
token-system/
├── src/
│   ├── main/
│   │   ├── java/com/toolshare/tokens/
│   │   └── resources/
│   └── test/
├── pom.xml
└── README.md
```

### 3.5 Maven Configuration (pom.xml)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.5</version>
        <relativePath/>
    </parent>
    
    <groupId>com.toolshare</groupId>
    <artifactId>token-system</artifactId>
    <version>1.0.0</version>
    <name>ToolShare Token System</name>
    <description>Trust Token Management System</description>
    
    <properties>
        <java.version>11</java.version>
        <spring-cloud.version>2022.0.4</spring-cloud.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-cache</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 3.6 Application Configuration

Create `src/main/resources/application.yml`:
```yaml
server:
  port: 8080
  servlet:
    context-path: /

spring:
  application:
    name: token-system
  
  datasource:
    url: jdbc:postgresql://localhost:5432/token_system
    username: token_user
    password: ${DB_PASSWORD:default_password}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  
  redis:
    host: localhost
    port: 6379
    password: ${REDIS_PASSWORD:}
    timeout: 2000ms
  
  cache:
    type: redis

logging:
  level:
    com.toolshare.tokens: DEBUG
    org.springframework.security: DEBUG
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"

token:
  initial-balance: 5
  cost-per-borrow: 1
  reward-per-lend: 1
  max-balance: 100
  
security:
  jwt:
    secret: ${JWT_SECRET:your-secret-key}
    expiration: 86400000 # 24 hours
  
rate-limiting:
  requests-per-minute: 60
  requests-per-hour: 1000
```

### 3.7 Run Java Application
```bash
# Compile and run
mvn clean compile
mvn spring-boot:run

# Or create executable JAR
mvn clean package
java -jar target/token-system-1.0.0.jar

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## 4. Docker Setup (Optional but Recommended)

### 4.1 Create Docker Compose File

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: toolshare
      POSTGRES_USER: toolshare_user
      POSTGRES_PASSWORD: toolshare_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - toolshare-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - toolshare-network

  # Python Backend
  python-backend:
    build:
      context: ./python-backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://toolshare_user:toolshare_password@postgres:5432/toolshare
      - REDIS_URL=redis://redis:6379
      - JAVA_TOKEN_SERVICE_URL=http://java-token-system:8080
    depends_on:
      - postgres
      - redis
      - java-token-system
    networks:
      - toolshare-network
    volumes:
      - ./python-backend:/app
      - uploads:/app/uploads

  # Java Token System
  java-token-system:
    build:
      context: ./java-token-system
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - DB_PASSWORD=toolshare_password
    depends_on:
      - postgres
      - redis
    networks:
      - toolshare-network

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - python-backend
      - java-token-system
    networks:
      - toolshare-network

volumes:
  postgres_data:
  redis_data:
  uploads:

networks:
  toolshare-network:
    driver: bridge
```

### 4.2 Docker Files

#### Python Backend Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Java Token System Dockerfile
```dockerfile
FROM openjdk:11-jre-slim

WORKDIR /app

# Copy JAR file
COPY target/token-system-1.0.0.jar app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 4.3 Run Docker Environment
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f python-backend
docker-compose logs -f java-token-system

# Stop services
docker-compose down

# Clean up
docker-compose down -v
```

## 5. Development Tools and Extensions

### 5.1 VS Code Extensions
```bash
# Flutter/Dart
code --install-extension Dart-Code.flutter
code --install-extension Dart-Code.dart-code

# Python
code --install-extension ms-python.python
code --install-extension ms-python.flake8
code --install-extension ms-python.black-formatter

# Java
code --install-extension redhat.java
code --install-extension vscjava.vscode-java-pack

# Database
code --install-extension ms-ossdata.vscode-postgresql
code --install-extension cweijan.vscode-redis-client

# Docker
code --install-extension ms-azuretools.vscode-docker

# Git
code --install-extension eamodio.gitlens
code --install-extension ms-vscode.git-graph

# General
code --install-extension ms-vscode.vscode-json
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
```

### 5.2 Browser Extensions
- **React Developer Tools** - For debugging Flutter web builds
- **Flutter Inspector** - For mobile debugging
- **Postman** - For API testing
- **Redis Desktop Manager** - For Redis management
- **DBeaver** - For database management

## 6. Testing Setup

### 6.1 Flutter Testing
```bash
# Run unit tests
flutter test

# Run widget tests
flutter test test/widget/

# Run integration tests
flutter test integration_test/

# Generate test coverage
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html
```

### 6.2 Python Testing
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v
```

### 6.3 Java Testing
```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report

# Run specific test class
mvn test -Dtest=TokenServiceTest

# Run integration tests
mvn verify
```

## 7. CI/CD Setup

### 7.1 GitHub Actions

Create `.github/workflows/ci.yml`:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  flutter-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: subosito/flutter-action@v2
      with:
        flutter-version: '3.16.0'
    - run: flutter pub get
    - run: flutter test
    - run: flutter analyze

  python-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    - run: pip install -r python-backend/requirements.txt
    - run: pytest python-backend/

  java-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-java@v3
      with:
        java-version: '11'
        distribution: 'temurin'
    - run: mvn test -f java-token-system/pom.xml

  build-and-deploy:
    needs: [flutter-test, python-test, java-test]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to production
      run: |
        # Deployment commands here
        echo "Deploying to production..."
```

## 8. Common Issues and Solutions

### 8.1 Flutter Issues

#### Flutter Doctor Issues
```bash
# Missing Android licenses
flutter doctor --android-licenses

# CocoaPods issues (iOS)
cd ios && pod install && pod update

# Gradle issues (Android)
cd android && ./gradlew clean
```

#### Hot Reload Not Working
```bash
# Check for errors in console
flutter clean
flutter pub get
flutter run
```

### 8.2 Python Issues

#### Virtual Environment Issues
```bash
# Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U toolshare_user -d toolshare
```

### 8.3 Java Issues

#### Maven Dependency Issues
```bash
# Clean and rebuild
mvn clean
mvn dependency:resolve
mvn compile
```

#### Port Conflicts
```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
```

## 9. Performance Monitoring

### 9.1 Flutter Performance
```bash
# Enable performance overlay
flutter run --profile

# Analyze performance
flutter run --trace-startup
flutter run --trace-skia
```

### 9.2 Backend Performance
```bash
# Python profiling
pip install py-spy
py-spy -o profile.txt -- uvicorn app.main:app

# Java profiling
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-XX:+UnlockCommercialFeatures -XX:+FlightRecorder"
```

## 10. Security Best Practices

### 10.1 Environment Variables
- Never commit secrets to version control
- Use `.env` files for local development
- Use secret management services in production

### 10.2 API Keys
- Store API keys securely
- Rotate keys regularly
- Use API key restrictions

### 10.3 Database Security
- Use strong passwords
- Enable SSL/TLS
- Regular security updates

## 11. Backup and Recovery

### 11.1 Code Backup
```bash
# Git backup
git remote add backup <backup-repository-url>
git push backup main

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf toolshare_backup_$DATE.tar.gz /path/to/project
```

### 11.2 Database Backup
```bash
# PostgreSQL backup
pg_dump -h localhost -U toolshare_user toolshare > backup_$(date +%Y%m%d).sql

# Automated backup with cron
0 2 * * * /usr/local/bin/backup_database.sh
```

This comprehensive setup guide ensures a smooth development experience for the entire ToolShare platform.