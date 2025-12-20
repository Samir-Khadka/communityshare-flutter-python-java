package com.toolshare.tokens.service;

import com.toolshare.tokens.model.entity.Token;
import com.toolshare.tokens.model.entity.TokenTransaction;
import com.toolshare.tokens.model.dto.TokenBalanceDto;
import com.toolshare.tokens.model.dto.TokenTransactionDto;
import com.toolshare.tokens.model.dto.TokenRequestDto;
import com.toolshare.tokens.model.enums.TransactionType;
import com.toolshare.tokens.model.enums.TransactionStatus;
import com.toolshare.tokens.repository.TokenRepository;
import com.toolshare.tokens.repository.TransactionRepository;
import com.toolshare.tokens.exception.InsufficientTokensException;
import com.toolshare.tokens.exception.InvalidTransactionException;
import com.toolshare.tokens.exception.FraudDetectionException;

import com.toolshare.tokens.util.CryptoUtils;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.CacheEvict;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Service class for managing Trust Token operations
 * 
 * This service handles all token-related business logic including:
 * - Token balance management
 * - Transaction processing
 * - Token validation
 * - Fraud detection
 * - Token distribution
 */
@Service
@Transactional
@SuppressWarnings("null")
public class TokenService {

    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ValidationService validationService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditService auditService;

    /**
     * Get current token balance for a user
     */
    @Cacheable(value = "tokenBalance", key = "#userId")
    public TokenBalanceDto getTokenBalance(String userId) {
        validationService.validateUserId(userId);

        Token token = tokenRepository.findByUserId(userId)
                .orElseThrow(() -> new InvalidTransactionException("User not found"));

        auditService.logAudit("TOKEN_BALANCE_CHECK", userId, "Retrieved token balance");

        return TokenBalanceDto.builder()
                .userId(userId)
                .balance(token.getBalance())
                .availableBalance(token.getAvailableBalance())
                .frozenBalance(token.getFrozenBalance())
                .lastUpdated(token.getLastUpdated())
                .build();
    }

    /**
     * Process a token transaction (borrow/lend)
     */
    @CacheEvict(value = "tokenBalance", key = "#request.userId")
    public TokenTransactionDto processTransaction(TokenRequestDto request) {
        // Validate request
        validationService.validateTokenRequest(request);

        // Check for fraud
        if (validationService.isSuspiciousActivity(request.getUserId())) {
            throw new FraudDetectionException("Suspicious activity detected");
        }

        Token token = tokenRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new InvalidTransactionException("User not found"));

        // Check sufficient balance
        if (request.getTransactionType() == TransactionType.BORROW &&
                token.getAvailableBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientTokensException("Insufficient tokens for this transaction");
        }

        // Create transaction
        TokenTransaction transaction = createTransaction(request, token);

        // Update token balance
        updateTokenBalance(token, transaction);

        // Save transaction
        transaction = transactionRepository.save(transaction);
        tokenRepository.save(token);

        // Send notification
        notificationService.sendTransactionNotification(transaction);

        // Log audit
        auditService.logTransaction(transaction);

        return convertToDto(transaction);
    }

    /**
     * Distribute tokens for lending completion
     */
    @CacheEvict(value = "tokenBalance", key = "#lenderId")
    public TokenTransactionDto distributeTokens(String lenderId, String borrowerId, BigDecimal amount) {
        validationService.validateUserId(lenderId);
        validationService.validateUserId(borrowerId);
        validationService.validateAmount(amount);

        Token lenderToken = tokenRepository.findByUserId(lenderId)
                .orElseThrow(() -> new InvalidTransactionException("Lender not found"));

        // Create distribution transaction
        TokenTransaction distribution = TokenTransaction.builder()
                .id(UUID.randomUUID().toString())
                .userId(lenderId)
                .amount(amount)
                .transactionType(TransactionType.DISTRIBUTION)
                .status(TransactionStatus.COMPLETED)
                .referenceId(borrowerId)
                .description("Token reward for successful lending")
                .createdAt(LocalDateTime.now())
                .signature(CryptoUtils.signTransaction(lenderId, amount))
                .build();

        // Update lender balance
        lenderToken.setBalance(lenderToken.getBalance().add(amount));
        lenderToken.setAvailableBalance(lenderToken.getAvailableBalance().add(amount));
        lenderToken.setLastUpdated(LocalDateTime.now());

        // Save
        transactionRepository.save(distribution);
        tokenRepository.save(lenderToken);

        // Send notification
        notificationService.sendTokenDistributionNotification(distribution);

        // Log audit
        auditService.logTransaction(distribution);

        return convertToDto(distribution);
    }

    /**
     * Freeze tokens for a transaction
     */
    @CacheEvict(value = "tokenBalance", key = "#userId")
    public void freezeTokens(String userId, BigDecimal amount, String transactionId) {
        validationService.validateUserId(userId);
        validationService.validateAmount(amount);

        Token token = tokenRepository.findByUserId(userId)
                .orElseThrow(() -> new InvalidTransactionException("User not found"));

        if (token.getAvailableBalance().compareTo(amount) < 0) {
            throw new InsufficientTokensException("Insufficient available tokens");
        }

        token.setAvailableBalance(token.getAvailableBalance().subtract(amount));
        token.setFrozenBalance(token.getFrozenBalance().add(amount));
        token.setLastUpdated(LocalDateTime.now());

        tokenRepository.save(token);

        auditService.logAudit("TOKENS_FROZEN", userId,
                String.format("Frozen %s tokens for transaction %s", amount, transactionId));
    }

    /**
     * Unfreeze tokens
     */
    @CacheEvict(value = "tokenBalance", key = "#userId")
    public void unfreezeTokens(String userId, BigDecimal amount, String transactionId) {
        validationService.validateUserId(userId);
        validationService.validateAmount(amount);

        Token token = tokenRepository.findByUserId(userId)
                .orElseThrow(() -> new InvalidTransactionException("User not found"));

        if (token.getFrozenBalance().compareTo(amount) < 0) {
            throw new InvalidTransactionException("Insufficient frozen tokens");
        }

        token.setFrozenBalance(token.getFrozenBalance().subtract(amount));
        token.setAvailableBalance(token.getAvailableBalance().add(amount));
        token.setLastUpdated(LocalDateTime.now());

        tokenRepository.save(token);

        auditService.logAudit("TOKENS_UNFROZEN", userId,
                String.format("Unfroze %s tokens for transaction %s", amount, transactionId));
    }

    /**
     * Get transaction history for a user
     */
    public List<TokenTransactionDto> getTransactionHistory(String userId, int page, int size) {
        validationService.validateUserId(userId);

        Pageable pageable = PageRequest.of(page, size);
        List<TokenTransaction> transactions = transactionRepository
                .findByUserIdOrderByCreatedAtDesc(userId, pageable);

        return transactions.stream()
                .map(this::convertToDto)
                .toList();
    }

    /**
     * Validate token balance for a transaction
     */
    public boolean validateTokenBalance(String userId, BigDecimal amount) {
        try {
            TokenBalanceDto balance = getTokenBalance(userId);
            return balance.getAvailableBalance().compareTo(amount) >= 0;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Create initial token balance for new user
     */
    public Token createInitialTokenBalance(String userId) {
        validationService.validateUserId(userId);

        Token token = Token.builder()
                .id(UUID.randomUUID().toString())
                .userId(userId)
                .balance(new BigDecimal("5")) // Initial 5 tokens
                .availableBalance(new BigDecimal("5"))
                .frozenBalance(BigDecimal.ZERO)
                .totalEarned(BigDecimal.ZERO)
                .totalSpent(BigDecimal.ZERO)
                .lastUpdated(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();

        token = tokenRepository.save(token);

        auditService.logAudit("INITIAL_TOKENS_CREATED", userId, "Created initial token balance");

        return token;
    }

    private TokenTransaction createTransaction(TokenRequestDto request, Token token) {
        return TokenTransaction.builder()
                .id(UUID.randomUUID().toString())
                .userId(request.getUserId())
                .amount(request.getAmount())
                .transactionType(request.getTransactionType())
                .status(TransactionStatus.PENDING)
                .referenceId(request.getReferenceId())
                .description(request.getDescription())
                .createdAt(LocalDateTime.now())
                .signature(CryptoUtils.signTransaction(request.getUserId(), request.getAmount()))
                .build();
    }

    private void updateTokenBalance(Token token, TokenTransaction transaction) {
        switch (transaction.getTransactionType()) {
            case BORROW:
                token.setAvailableBalance(token.getAvailableBalance().subtract(transaction.getAmount()));
                token.setFrozenBalance(token.getFrozenBalance().add(transaction.getAmount()));
                token.setTotalSpent(token.getTotalSpent().add(transaction.getAmount()));
                break;
            case LEND:
                token.setFrozenBalance(token.getFrozenBalance().subtract(transaction.getAmount()));
                token.setTotalEarned(token.getTotalEarned().add(transaction.getAmount()));
                break;
            case REFUND:
                token.setAvailableBalance(token.getAvailableBalance().add(transaction.getAmount()));
                token.setFrozenBalance(token.getFrozenBalance().subtract(transaction.getAmount()));
                break;
            case DISTRIBUTION:
                token.setAvailableBalance(token.getAvailableBalance().add(transaction.getAmount()));
                token.setTotalEarned(token.getTotalEarned().add(transaction.getAmount()));
                break;
            case ADMIN_ADJUSTMENT:
                token.setAvailableBalance(token.getAvailableBalance().add(transaction.getAmount()));
                token.setBalance(token.getBalance().add(transaction.getAmount()));
                break;
            case PENALTY:
                token.setAvailableBalance(token.getAvailableBalance().subtract(transaction.getAmount()));
                token.setBalance(token.getBalance().subtract(transaction.getAmount()));
                break;
        }

        token.setLastUpdated(LocalDateTime.now());
        transaction.setStatus(TransactionStatus.COMPLETED);
    }

    private TokenTransactionDto convertToDto(TokenTransaction transaction) {
        return TokenTransactionDto.builder()
                .id(transaction.getId())
                .userId(transaction.getUserId())
                .amount(transaction.getAmount())
                .transactionType(transaction.getTransactionType())
                .status(transaction.getStatus())
                .referenceId(transaction.getReferenceId())
                .description(transaction.getDescription())
                .createdAt(transaction.getCreatedAt())
                .signature(transaction.getSignature())
                .build();
    }
}