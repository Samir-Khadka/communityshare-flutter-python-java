package com.toolshare.tokens.repository;

import com.toolshare.tokens.model.entity.TokenTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface TransactionRepository extends JpaRepository<TokenTransaction, String> {
    List<TokenTransaction> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
}
