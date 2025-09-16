package com.example.backend.repo;

import com.example.backend.domain.AgencyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgencyRepo extends JpaRepository<AgencyEntity, Long> {
    @Query("SELECT DISTINCT a FROM AgencyEntity a LEFT JOIN FETCH a.requirements")
    List<AgencyEntity> findAllWithRequirements();

    @Query("SELECT DISTINCT a FROM AgencyEntity a LEFT JOIN FETCH a.requirements WHERE a.title = :title")
    Optional<AgencyEntity> findByTitleWithRequirements(@Param("title") String title);
}
