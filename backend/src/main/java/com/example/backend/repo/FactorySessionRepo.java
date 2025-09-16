package com.example.backend.repo;

import com.example.backend.domain.FactorySessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FactorySessionRepo extends JpaRepository<FactorySessionEntity, Long> {
    Optional<FactorySessionEntity> findByUsername(String username);
    void deleteByUsername(String username);
}
