package com.toolshare.tokens.service;

import org.springframework.stereotype.Service;

@Service
public class AuditService {
    public void logAudit(String action, String userId, String details) {}
    public void logTransaction(Object transaction) {}
}
