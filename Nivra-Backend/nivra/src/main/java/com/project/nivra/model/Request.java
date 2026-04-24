package com.project.nivra.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "requests")

@Data
@NoArgsConstructor
@AllArgsConstructor

public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long consumerId;

    private Long sellerId;

    private Long productId;

    private String status;

    private LocalDateTime createdAt;
}