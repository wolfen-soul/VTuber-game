package com.example.backend.repo;

import com.example.backend.domain.RegistrationLimit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface RegistrationLimitRepo extends JpaRepository<RegistrationLimit, Long> {

    @Query("SELECT COUNT(rl) FROM RegistrationLimit rl WHERE rl.ipAddress = :ipAddress AND rl.active = true")
    int countActiveByIpAddress(@Param("ipAddress") String ipAddress);

    @Query("SELECT COUNT(rl) FROM RegistrationLimit rl WHERE rl.deviceFingerprint = :deviceFingerprint AND rl.active = true")
    int countActiveByDeviceFingerprint(@Param("deviceFingerprint") String deviceFingerprint);

    @Query("SELECT rl FROM RegistrationLimit rl WHERE rl.username = :username AND rl.active = true")
    List<RegistrationLimit> findByUsername(@Param("username") String username);

    @Modifying
    @Transactional
    @Query("UPDATE RegistrationLimit rl SET rl.active = false WHERE rl.username = :username")
    void deactivateByUsername(@Param("username") String username);

    @Query("SELECT rl FROM RegistrationLimit rl WHERE rl.ipAddress = :ipAddress AND rl.deviceFingerprint = :deviceFingerprint AND rl.active = true")
    List<RegistrationLimit> findByIpAndDevice(@Param("ipAddress") String ipAddress,
                                              @Param("deviceFingerprint") String deviceFingerprint);
}