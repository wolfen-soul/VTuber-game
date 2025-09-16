package com.example.backend.repo;

import com.example.backend.domain.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepo extends JpaRepository<ItemEntity, Long> {
        Optional<ItemEntity> findByTitle(String title);
        Optional<ItemEntity> findFirstByCategoryOrderByTierAsc(String category);
        List<ItemEntity> findByCategory(String category);
        Optional<ItemEntity> findByCategoryAndTier(String category, int tier);
}

