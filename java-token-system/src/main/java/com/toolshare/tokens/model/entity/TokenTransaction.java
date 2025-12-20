package com.toolshare.tokens.model.entity;

import com.toolshare.tokens.model.enums.TransactionType;
import com.toolshare.tokens.model.enums.TransactionStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "token_transactions")
public class TokenTransaction {
    @Id
    private String id;
    private String userId;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status;

    private String referenceId;
    private String description;
    private LocalDateTime createdAt;
    private String signature;
}
