package com.example.backend.repo;

import com.example.backend.domain.StreamSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StreamSessionRepo extends JpaRepository<StreamSessionEntity, Long> {
    Optional<StreamSessionEntity> findByUsername(String username);
    void deleteByUsername(String username);
}
