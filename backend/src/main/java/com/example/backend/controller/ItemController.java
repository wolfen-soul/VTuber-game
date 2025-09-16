package com.example.backend.controller;

import com.example.backend.application.ItemService;
import com.example.backend.dto.game.ItemDto;
import com.example.backend.mapper.ItemMapper;
import com.example.backend.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    private final ItemService itemService;
    private final ItemMapper itemMapper;

    public ItemController(ItemMapper itemMapper, ItemService itemService) {
        this.itemMapper = itemMapper;
        this.itemService = itemService;
    }

    @GetMapping("/catalog")
    public List<ItemDto> getItemsCatalog(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return itemService.getCatalog(userPrincipal.getUsername());
    }

    @GetMapping("/owned")
    public List<ItemDto> getOwnedItems(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return itemService.getOwned(userPrincipal.getUsername()).stream().map(itemMapper::toDto).toList();
    }

    @PostMapping("/buy/{item}")
    public ResponseEntity<?> buyItem(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                     @PathVariable("item") String itemName) {
        itemService.buyItem(userPrincipal.getUsername(), itemName);
        return ResponseEntity.ok("Purchase is completed");
    }
}
