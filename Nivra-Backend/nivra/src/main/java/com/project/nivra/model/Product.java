package com.project.nivra.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double price;
    private int quantity;       // ✅ Added: frontend sends quantity
    private String image;       // stores file path after upload
    private String category;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;
}
