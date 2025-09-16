package com.example.backend.repo;

import com.example.backend.domain.BanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BanRepo extends JpaRepository<BanEntity, String> {
    boolean existsByUsernameAndCategory(String username, String category);
    Optional<BanEntity> findByUsernameAndCategory(String username, String category);
    void deleteByUsername(String username);
    void deleteByUsernameAndCategory(String username, String category);
}
