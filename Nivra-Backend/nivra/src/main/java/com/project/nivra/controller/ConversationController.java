package com.project.nivra.controller;

import com.project.nivra.model.Conversation;
import com.project.nivra.model.Message;
import com.project.nivra.repository.ConversationRepository;
import com.project.nivra.repository.MessageRepository;
import com.project.nivra.repository.ProductRepository;
import com.project.nivra.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ConversationController {

    @Autowired
    private ConversationRepository conversationRepo;

    @Autowired
    private MessageRepository messageRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductRepository productRepo;

    // CREATE OR GET CONVERSATION
    @PostMapping("/conversation")
    public Conversation createConversation(@RequestBody Conversation req) {

        Optional<Conversation> existing =
                conversationRepo.findByBuyerIdAndSellerIdAndProductId(
                        req.getBuyerId(),
                        req.getSellerId(),
                        req.getProductId()
                );

        // If already exists, return existing conversation
        if (existing.isPresent()) {
            return existing.get();
        }

        // Auto-resolve buyer name
        userRepo.findById(req.getBuyerId())
                .ifPresent(user -> req.setBuyerName(user.getName()));

        // Auto-resolve seller name
        userRepo.findById(req.getSellerId())
                .ifPresent(user -> req.setSellerName(user.getName()));

        // Auto-resolve product name
        productRepo.findById(req.getProductId())
                .ifPresent(product -> req.setProductName(product.getName()));

        req.setUpdatedAt(LocalDateTime.now());

        // ✅ DEBUG
        System.out.println("Product Name: " + req.getProductName());

        return conversationRepo.save(req);
    }

    // GET ALL CONVERSATIONS FOR SELLER
    @GetMapping("/conversation/seller/{sellerId}")
    public List<Conversation> getSellerChats(@PathVariable Long sellerId) {

        return conversationRepo.findBySellerIdOrderByUpdatedAtDesc(sellerId);
    }

    // GET ALL CONVERSATIONS FOR BUYER
    @GetMapping("/conversation/buyer/{buyerId}")
    public List<Conversation> getBuyerChats(@PathVariable Long buyerId) {

        return conversationRepo.findByBuyerIdOrderByUpdatedAtDesc(buyerId);
    }

    // GET ALL MESSAGES IN A CONVERSATION
    @GetMapping("/messages/{conversationId}")
    public List<Message> getMessages(@PathVariable Long conversationId) {

        return messageRepo.findByConversationIdOrderByTimestampAsc(conversationId);
    }

    // SEND MESSAGE (REST fallback)
    @PostMapping("/message")
    public Message sendMessage(@RequestBody Message msg) {

        msg.setTimestamp(LocalDateTime.now());

        Message saved = messageRepo.save(msg);

        conversationRepo.findById(msg.getConversationId()).ifPresent(conv -> {

            conv.setLastMessage(msg.getMessage());

            conv.setUpdatedAt(LocalDateTime.now());

            conversationRepo.save(conv);
        });

        return saved;
    }
}