package com.project.nivra.controller;

import com.project.nivra.dto.RequestResponseDTO;
import com.project.nivra.model.Request;
import com.project.nivra.service.RequestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:3000")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @PostMapping
    public Request createRequest(@RequestBody Request request) {

        return requestService.createRequest(
                request.getConsumerId(),
                request.getProductId()
        );
    }
    @GetMapping("/seller/{sellerId}")
    public List<RequestResponseDTO> getSellerRequests(@PathVariable Long sellerId) {
        return requestService.getSellerRequests(sellerId);
    }
}