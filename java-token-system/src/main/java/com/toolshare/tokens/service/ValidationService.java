package com.toolshare.tokens.service;

import com.toolshare.tokens.model.dto.TokenRequestDto;
import org.springframework.stereotype.Service;

@Service
public class ValidationService {
    public void validateUserId(String userId) {}
    public void validateTokenRequest(TokenRequestDto request) {}
    public boolean isSuspiciousActivity(String userId) { return false; }
    public void validateAmount(Object amount) {}
}
