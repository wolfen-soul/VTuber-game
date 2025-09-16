package com.example.backend.application;

import com.example.backend.domain.GameStateEntity;
import com.example.backend.domain.ItemEntity;
import com.example.backend.dto.game.ItemDto;
import com.example.backend.exception.NotFoundException;
import com.example.backend.mapper.ItemMapper;
import com.example.backend.repo.ItemRepo;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class ItemService {
    private final ItemRepo itemRepo;
    private final ItemMapper itemMapper;
    private final UserService userService;

    public ItemService(ItemRepo itemRepo, ItemMapper itemMapper, UserService userService) {
        this.itemRepo = itemRepo;
        this.itemMapper = itemMapper;
        this.userService = userService;
    }

    public List<ItemEntity> all() {
        return itemRepo.findAll();
    }

    public List<ItemDto> getCatalog(String username) {
        GameStateEntity gameState = userService.getGameState(username);

        return itemRepo.findAll().stream()
                .map(item -> {
                    int finalPrice = gameState.getDiscountedPrice(item);
                    return itemMapper.toDtoWithDiscount(item, finalPrice);
                })
                .toList();
    }

    public ItemEntity get(String title) {
        return itemRepo.findByTitle(title)
                .orElseThrow(() -> new NotFoundException(HttpStatus.NOT_FOUND, "Item not found"));
    }

    @Transactional
    public void edit(Long id, ItemEntity item) {
        if (!itemRepo.existsById(id)) {
            throw new NotFoundException(HttpStatus.NOT_FOUND, "Item not found");
        }
        itemRepo.save(item);
    }

    @Transactional
    public void add(String title, String category, int tier, int price, String bonusCategory, double bonus) {
        itemRepo.save(new ItemEntity(title, category, tier, price, bonusCategory, bonus));
    }

    @Transactional
    public void add(ItemEntity item) {
        itemRepo.save(item);
    }

    @Transactional
    public void buyItem(String username, String title) {
        ItemEntity item = get(title);

        synchronized (username.intern()) {
            GameStateEntity gameState = userService.getGameState(username);
            validatePurchase(item, gameState.getOwnedItems());
            gameState.purchaseItem(item);
        }
    }

    public List<ItemEntity> getOwned(String username) {
        GameStateEntity gameState = userService.getGameState(username);
        return gameState.getOwnedItems();
    }

    private void validatePurchase(ItemEntity item, List<ItemEntity> ownedItems) {
        if (ownedItems.contains(item)) {
            throw new IllegalArgumentException("Cannot buy the same item twice");
        }

        List<String> subcategories = getSubcategoriesForCategory(item.getCategory());

        Map<String, Integer> maxTiersPerSubcategory = new HashMap<>();
        for (String subcategory : subcategories) {
            int maxTier = ownedItems.stream()
                    .filter(i -> i.getCategory().equals(subcategory))
                    .mapToInt(ItemEntity::getTier)
                    .max()
                    .orElse(0);
            maxTiersPerSubcategory.put(subcategory, maxTier);
        }

        int maxOwnedTierInSubcategory = maxTiersPerSubcategory.get(item.getCategory());
        if (item.getTier() < maxOwnedTierInSubcategory) {
            throw new IllegalArgumentException("Cannot buy item with lower tier than you already own");
        }

        int minMaxTier = maxTiersPerSubcategory.values().stream()
                .mapToInt(Integer::intValue)
                .min()
                .orElse(0);

        if (item.getTier() > minMaxTier + 1) {
            if (subcategories.size() > 1) {
                String generalCategory = subcategories.getFirst().substring(0, subcategories.getFirst().indexOf('-'));
                throw new IllegalArgumentException(String.format(
                        "Too high-tier item for your current equipment, category: %s", generalCategory));   // edit
            }
            throw new IllegalArgumentException("Cannot buy item with such high tier");
        }
    }

    private List<String> getSubcategoriesForCategory(String category) {
        if (category.startsWith("pc-")) {
            return Arrays.asList("pc-cases", "pc-cpus", "pc-gpus", "pc-motherboards", "pc-ram", "pc-storage", "pc-cooling");
        }
        if (category.startsWith("hardware-")) {
            return Arrays.asList("hardware-keyboards", "hardware-mice", "hardware-headphones", "hardware-monitors", "hardware-mats");
        }
        return Collections.singletonList(category);
    }
}
