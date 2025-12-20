package com.toolshare.tokens.controller;

import com.toolshare.tokens.model.dto.TokenBalanceDto;
import com.toolshare.tokens.model.dto.TokenRequestDto;
import com.toolshare.tokens.model.dto.TokenTransactionDto;
import com.toolshare.tokens.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/tokens")
public class TokenController {

    @Autowired
    private TokenService tokenService;

    @GetMapping("/balance/{userId}")
    public ResponseEntity<TokenBalanceDto> getBalance(@PathVariable String userId) {
        return ResponseEntity.ok(tokenService.getTokenBalance(userId));
    }

    @PostMapping("/transaction")
    public ResponseEntity<TokenTransactionDto> processTransaction(@RequestBody TokenRequestDto request) {
        return ResponseEntity.ok(tokenService.processTransaction(request));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<TokenTransactionDto>> getHistory(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(tokenService.getTransactionHistory(userId, page, size));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "healthy");
        return ResponseEntity.ok(status);
    }
}
