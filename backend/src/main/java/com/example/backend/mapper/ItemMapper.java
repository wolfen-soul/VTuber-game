package com.example.backend.mapper;

import com.example.backend.domain.ItemEntity;
import com.example.backend.dto.game.ItemDto;
import org.springframework.stereotype.Component;

@Component
public class ItemMapper {
    public ItemDto toDto(ItemEntity item) {
        return new ItemDto(
                item.getTitle(),
                item.getCategory(),
                item.getTier(),
                item.getPrice(),
                item.getBonusCategory(),
                item.getBonus()
        );
    }

    public ItemDto toDtoWithDiscount(ItemEntity item, int finalPrice) {
        return new ItemDto(
                item.getTitle(),
                item.getCategory(),
                item.getTier(),
                finalPrice,
                item.getBonusCategory(),
                item.getBonus()
        );
    }
}
