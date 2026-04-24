package com.project.nivra.service;

import com.project.nivra.model.Role;
import com.project.nivra.model.User;
import com.project.nivra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // ✅ REGISTER
    public User register(User user) {
        userRepository.findByEmail(user.getEmail()).ifPresent(u -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        });

        // ⚠️ DO NOT override verified here
        return userRepository.save(user);
    }

    // ✅ LOGIN with role check
    public User loginWithRole(String email, String password, Role expectedRole) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!user.getPassword().equals(password)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect password");
        }

        // ✅ FIXED: Only check exact role
        if (user.getRole() != expectedRole) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "This account is not registered as " + expectedRole.toString().toLowerCase());
        }

        // ✅ Only BUYER needs verification
        if (user.getRole() == Role.BUYER && !user.isVerified()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Account not verified by admin yet");
        }

        return user;
    }
    public User adminLogin(String email, String password) {

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));

        if (!admin.getPassword().equals(password)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect password");
        }

        if (admin.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not an admin account");
        }

        return admin;
    }
}