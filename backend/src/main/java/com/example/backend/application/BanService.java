package com.example.backend.application;

import com.example.backend.domain.BanEntity;
import com.example.backend.exception.NotFoundException;
import com.example.backend.repo.BanRepo;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class BanService {
    private final BanRepo banRepo;

    private final ZoneId MOSCOW_ZONE = ZoneId.of("Europe/Moscow");
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public BanService(BanRepo banRepo) {
        this.banRepo = banRepo;
    }

    public boolean checkBan(String username, String category) {
        if (!banRepo.existsByUsernameAndCategory(username, category)) {
            return false;
        }

        BanEntity ban = findUserBanInCategory(username, category);
        if (!ban.isExpired()) {
            return true;
        }

        unbanUser(username, category);
        return false;

    }

    @Transactional
    public void banUser(String username, String category, int banTime) {
        if (!banRepo.existsByUsernameAndCategory(username, category)) {
            ZonedDateTime banEndTime = ZonedDateTime.now(ZoneOffset.UTC).plusMinutes(banTime);
            BanEntity ban = new BanEntity(username, category, banEndTime.toLocalDateTime());
            banRepo.save(ban);
        }
    }

    @Transactional
    public void unbanUser(String username, String category) {
        banRepo.deleteByUsernameAndCategory(username, category);
    }

    public BanEntity findUserBanInCategory(String username, String category) {
        return banRepo.findByUsernameAndCategory(username, category)
                .orElseThrow(() -> new NotFoundException(HttpStatus.NOT_FOUND, "Ban not found"));
    }

    public String getFormattedTime(String username, String category) {
        BanEntity ban = findUserBanInCategory(username, category);
        return ban.getBanEndTime()
                .atZone(ZoneOffset.UTC)
                .withZoneSameInstant(MOSCOW_ZONE)
                .format(formatter);
    }

    @Transactional
    public void unbanUserFromAllCategories(String username) {
        banRepo.deleteByUsername(username);
    }
}
