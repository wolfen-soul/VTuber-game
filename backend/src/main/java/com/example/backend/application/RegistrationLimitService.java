package com.example.backend.application;

import com.example.backend.domain.RegistrationLimit;
import com.example.backend.repo.RegistrationLimitRepo;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
public class RegistrationLimitService {
    private final RegistrationLimitRepo registrationLimitRepo;
    private static final int MAX_REGISTRATIONS = 3;

    public RegistrationLimitService(RegistrationLimitRepo registrationLimitRepo) {
        this.registrationLimitRepo = registrationLimitRepo;
    }

    public boolean canRegister(HttpServletRequest request) {
        String ipAddress = getClientIpAddress(request);
        String deviceFingerprint = generateDeviceFingerprint(request);

        int ipRegistrations = registrationLimitRepo.countActiveByIpAddress(ipAddress);
        int deviceRegistrations = registrationLimitRepo.countActiveByDeviceFingerprint(deviceFingerprint);

        return ipRegistrations < MAX_REGISTRATIONS && deviceRegistrations < MAX_REGISTRATIONS;
    }

    public int getRemainingRegistrations(HttpServletRequest request) {
        String ipAddress = getClientIpAddress(request);
        String deviceFingerprint = generateDeviceFingerprint(request);

        int ipRegistrations = registrationLimitRepo.countActiveByIpAddress(ipAddress);
        int deviceRegistrations = registrationLimitRepo.countActiveByDeviceFingerprint(deviceFingerprint);

        int maxRegistrations = Math.max(ipRegistrations, deviceRegistrations);
        return MAX_REGISTRATIONS - maxRegistrations;
    }

    @Transactional
    public void recordRegistration(HttpServletRequest request, String username) {
        String ipAddress = getClientIpAddress(request);
        String deviceFingerprint = generateDeviceFingerprint(request);

        RegistrationLimit limit = new RegistrationLimit(ipAddress, deviceFingerprint, username);
        registrationLimitRepo.save(limit);
    }

    @Transactional
    public void releaseRegistration(String username) {
        registrationLimitRepo.deactivateByUsername(username);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    private String generateDeviceFingerprint(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        String accept = request.getHeader("Accept");
        String acceptEncoding = request.getHeader("Accept-Encoding");
        String acceptLanguage = request.getHeader("Accept-Language");

        String fingerprintData = String.join("|", userAgent, accept, acceptEncoding, acceptLanguage);
        return Integer.toHexString(fingerprintData.hashCode());
    }
}