package com.toolshare.tokens.repository;

import com.toolshare.tokens.model.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, String> {
    Optional<Token> findByUserId(String userId);
}
