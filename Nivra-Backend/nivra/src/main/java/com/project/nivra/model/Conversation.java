package com.project.nivra.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long buyerId;

    private Long sellerId;

    private Long productId;

    private String productName;

    private String buyerName;

    private String sellerName;

    private String lastMessage;

    private LocalDateTime updatedAt;
}