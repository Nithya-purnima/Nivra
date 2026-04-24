package com.project.nivra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RequestResponseDTO {

    private Long id;

    private String productName;

    private String productImage;

    private String buyerName;

    private String status;

    private Long consumerId;
}