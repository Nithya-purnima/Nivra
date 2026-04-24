package com.project.nivra.controller;

import com.project.nivra.model.Role;
import com.project.nivra.model.User;
import com.project.nivra.repository.UserRepository;
import com.project.nivra.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    // ===============================
    // ✅ ADMIN LOGIN
    // ===============================
    @PostMapping("/admin/login")
    public User adminLogin(@RequestBody User user) {
        return authService.adminLogin(user.getEmail(), user.getPassword());
    }

    // ===============================
    // ✅ GET PENDING BUYERS + NGOs
    // ===============================
    @GetMapping("/admin/pending")
    public List<User> getPendingBuyers() {
        // ✅ All pending users (consumers + NGOs) are Role.BUYER with verified=false
        return userRepository.findByRoleAndVerified(Role.BUYER, false);
    }

    // ===============================
    // ✅ APPROVE USER
    // ===============================
    @PutMapping("/admin/approve/{id}")
    public ResponseEntity<?> approve(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setVerified(true);
        userRepository.save(user);

        return ResponseEntity.ok("User Approved");
    }

    // ===============================
    // ✅ REJECT USER
    // ===============================
    @DeleteMapping("/admin/reject/{id}")
    public ResponseEntity<?> reject(@PathVariable Long id) {

        if (!userRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("User not found");
        }

        userRepository.deleteById(id);

        return ResponseEntity.ok("User Rejected");
    }
}