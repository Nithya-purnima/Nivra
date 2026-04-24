package com.project.nivra.controller;

import com.project.nivra.model.Product;
import com.project.nivra.model.Role;
import com.project.nivra.model.User;
import com.project.nivra.repository.ProductRepository;
import com.project.nivra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ProductController {

    private static final String UPLOAD_DIR = "C:/uploads/products/";

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ GET all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ✅ ADD product
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> addProduct(
            @RequestParam String name,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam double price,
            @RequestParam(defaultValue = "0") int quantity,
            @RequestParam Long sellerId,
            @RequestParam(required = false) MultipartFile image
    ) throws IOException {

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        if (seller.getRole() != Role.SELLER) {
            throw new RuntimeException("Only sellers can add products");
        }

        String imagePath = null;

        if (image != null && !image.isEmpty()) {
            imagePath = saveFile(image);
        }

        Product product = new Product();
        product.setName(name);
        product.setCategory(category);
        product.setDescription(description);
        product.setPrice(price);
        product.setQuantity(quantity);
        product.setSeller(seller);
        product.setImage(imagePath);

        return ResponseEntity.ok(productRepository.save(product));
    }

    // ✅ SAVE FILE
    private String saveFile(MultipartFile file) throws IOException {

        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) dir.mkdirs();

        String fileName = System.currentTimeMillis() + "_" +
                file.getOriginalFilename().replaceAll("[^a-zA-Z0-9\\.\\-]", "_");

        File dest = new File(UPLOAD_DIR + fileName);
        file.transferTo(dest);

        return fileName; // store only filename
    }

    // ✅ SERVE IMAGE (VERY IMPORTANT)
    @GetMapping("/image/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws MalformedURLException {

        Path path = Paths.get(UPLOAD_DIR).resolve(filename);
        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            throw new RuntimeException("Image not found");
        }

        return ResponseEntity.ok(resource);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return ResponseEntity.ok(product);
    }
}