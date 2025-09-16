package com.example.backend.repo;

import com.example.backend.domain.RequirementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequirementRepo extends JpaRepository<RequirementEntity, Long> {}
