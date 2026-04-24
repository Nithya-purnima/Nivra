package com.project.nivra.service;

import com.project.nivra.dto.RequestResponseDTO;
import com.project.nivra.model.Product;
import com.project.nivra.model.Request;
import com.project.nivra.model.User;
import com.project.nivra.repository.ProductRepository;
import com.project.nivra.repository.RequestRepository;

import com.project.nivra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RequestService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private ProductRepository productRepository;

    public Request createRequest(Long consumerId, Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Request request = new Request();

        request.setConsumerId(consumerId);

        // seller id from product
        request.setSellerId(product.getSeller().getId());

        request.setProductId(productId);

        request.setStatus("PENDING");

        request.setCreatedAt(LocalDateTime.now());

        return requestRepository.save(request);
    }
    public List<RequestResponseDTO> getSellerRequests(Long sellerId) {

        List<Request> requests = requestRepository.findBySellerId(sellerId);

        return requests.stream().map(request -> {

            Product product = productRepository.findById(request.getProductId())
                    .orElse(null);

            User buyer = userRepository.findById(request.getConsumerId())
                    .orElse(null);

            return new RequestResponseDTO(
                    request.getId(),
                    product != null ? product.getName() : "Unknown Product",
                    product != null ? product.getImage() : "",
                    buyer != null ? buyer.getName() : "Unknown Buyer",
                    request.getStatus(),
                    request.getConsumerId()
            );

        }).toList();
    }
}