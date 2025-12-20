package com.toolshare.tokens.model.dto;

import com.toolshare.tokens.model.enums.TransactionType;
import com.toolshare.tokens.model.enums.TransactionStatus;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TokenTransactionDto {
    private String id;
    private String userId;
    private BigDecimal amount;
    private TransactionType transactionType;
    private TransactionStatus status;
    private String referenceId;
    private String description;
    private LocalDateTime createdAt;
    private String signature;
}
