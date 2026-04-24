package com.project.nivra.repository;

import com.project.nivra.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Get all products of a seller
    List<Product> findBySeller_Id(Long sellerId);
}