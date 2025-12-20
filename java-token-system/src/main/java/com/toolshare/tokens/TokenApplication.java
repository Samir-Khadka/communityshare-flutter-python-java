package com.toolshare.tokens;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main application class for ToolShare Token Management System
 * 
 * This Spring Boot application manages the Trust Token System for the ToolShare platform.
 * It handles token transactions, validation, distribution, and audit logging.
 * 
 * Features:
 * - Token balance management
 * - Transaction processing
 * - Fraud detection
 * - Audit logging
 * - Real-time notifications
 * - Rate limiting
 * - Security and authentication
 */
@SpringBootApplication
@EnableCaching
@EnableAsync
@EnableScheduling
public class TokenApplication {

    public static void main(String[] args) {
        SpringApplication.run(TokenApplication.class, args);
    }
}