package com.example.backend.repo;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.backend.domain.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);
    Boolean existsByUsername(String username);

    @Query("SELECT u.username FROM UserEntity u JOIN u.gameState gs WHERE gs.agency IS NOT NULL")
    List<String> findAllUsernamesWithAgency();
}
