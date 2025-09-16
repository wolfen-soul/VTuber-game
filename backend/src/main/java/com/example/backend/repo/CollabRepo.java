package com.example.backend.repo;

import com.example.backend.domain.CollabEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollabRepo extends JpaRepository<CollabEntity, Long> {
    @Query("SELECT DISTINCT c FROM CollabEntity c LEFT JOIN FETCH c.requirements")
    List<CollabEntity> findAllWithRequirements();

    @Query("SELECT DISTINCT c FROM CollabEntity c LEFT JOIN FETCH c.requirements WHERE c.title = :title")
    Optional<CollabEntity> findByTitleWithRequirements(@Param("title") String title);
}
