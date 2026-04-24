package com.project.nivra.controller;

import com.project.nivra.model.Role;
import com.project.nivra.model.User;
import com.project.nivra.model.BuyerType; // ✅ IMPORTANT
import com.project.nivra.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ✅ REGISTER SELLER (NO VERIFICATION NEEDED)
    @PostMapping("/register/seller")
    public ResponseEntity<?> registerSeller(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String password
    ) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(password);
        user.setRole(Role.SELLER);
        user.setVerified(true); // ✅ seller does NOT need admin approval

        return ResponseEntity.ok(buildLoginResponse(authService.register(user)));
    }

    // ✅ REGISTER CONSUMER (BUYER TYPE)
    @PostMapping("/register/consumer")
    public ResponseEntity<?> registerConsumer(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam(required = false) String address,
            @RequestParam String password,
            @RequestParam MultipartFile certificate
    ) throws IOException {

        String filePath = saveFile(certificate, "users");

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(password);

        user.setRole(Role.BUYER); // ✅ FIX
        user.setBuyerType(BuyerType.CONSUMER); // ✅ FIX

        user.setIncomeCertificate(filePath);
        user.setVerified(false); // ✅ needs admin approval

        return ResponseEntity.ok(buildLoginResponse(authService.register(user)));
    }

    // ✅ REGISTER NGO (ALSO BUYER)
    @PostMapping("/register/ngo")
    public ResponseEntity<?> registerNgo(
            @RequestParam String orgName,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam(required = false) String address,
            @RequestParam String password,
            @RequestParam(required = false) MultipartFile certificate
    ) throws IOException {

        String filePath = null;
        if (certificate != null && !certificate.isEmpty()) {
            filePath = saveFile(certificate, "users");
        }

        User user = new User();
        user.setName(orgName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(password);

        user.setRole(Role.BUYER); // ✅ FIX (NOT NGO anymore)
        user.setBuyerType(BuyerType.NGO); // ✅ IMPORTANT

        user.setNgoCertificate(filePath);
        user.setVerified(false); // ✅ needs admin approval

        return ResponseEntity.ok(buildLoginResponse(authService.register(user)));
    }

    // ✅ LOGIN BUYER (USED BY BOTH CONSUMER + NGO)
    @PostMapping("/login/buyer")
    public ResponseEntity<?> loginBuyer(@RequestBody Map<String, String> body) {
        User user = authService.loginWithRole(body.get("email"), body.get("password"), Role.BUYER);
        return ResponseEntity.ok(buildLoginResponse(user));
    }

    // ✅ LOGIN SELLER
    @PostMapping("/login/seller")
    public ResponseEntity<?> loginSeller(@RequestBody Map<String, String> body) {
        User user = authService.loginWithRole(body.get("email"), body.get("password"), Role.SELLER);
        return ResponseEntity.ok(buildLoginResponse(user));
    }


    // ✅ RESPONSE
    private Map<String, Object> buildLoginResponse(User user) {
        Map<String, Object> res = new HashMap<>();
        res.put("userId", user.getId());
        res.put("name", user.getName());
        res.put("email", user.getEmail());
        res.put("role", user.getRole().toString());
        res.put("buyerType", user.getBuyerType()); // ✅ optional but useful
        res.put("verified", user.isVerified());
        res.put("token", "token-" + user.getId());
        return res;
    }

    // ✅ FILE SAVE (FIXED)
    private String saveFile(MultipartFile file, String folder) throws IOException {

        String baseDir = "C:/uploads";
        String uploadDir = baseDir + File.separator + folder;

        File dir = new File(uploadDir);
        if (!dir.exists() && !dir.mkdirs()) {
            throw new IOException("Failed to create directory");
        }

        String original = file.getOriginalFilename();
        if (original == null) original = "file";

        original = original.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");

        String fileName = System.currentTimeMillis() + "_" + original;

        File dest = new File(dir, fileName);
        file.transferTo(dest);

        return folder + "/" + fileName;
    }
}