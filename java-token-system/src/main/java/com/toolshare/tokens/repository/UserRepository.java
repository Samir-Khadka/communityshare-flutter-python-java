package com.toolshare.tokens.repository;

import com.toolshare.tokens.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
