package com.toolshare.tokens.model.dto;

import com.toolshare.tokens.model.enums.TransactionType;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TokenRequestDto {
    private String userId;
    private BigDecimal amount;
    private TransactionType transactionType;
    private String referenceId;
    private String description;
}
