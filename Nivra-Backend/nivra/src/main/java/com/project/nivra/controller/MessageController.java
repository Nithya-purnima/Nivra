package com.project.nivra.controller;

import com.project.nivra.model.Message;
import com.project.nivra.repository.ConversationRepository;
import com.project.nivra.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class MessageController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepo;

    @Autowired
    private ConversationRepository conversationRepo;

    @MessageMapping("/chat/{conversationId}")
    public void sendMessage(
            @DestinationVariable Long conversationId,
            Message message
    ) {
        // 1. Persist
        message.setConversationId(conversationId);
        message.setTimestamp(LocalDateTime.now());
        Message saved = messageRepo.save(message);

        // 2. Update conversation lastMessage
        conversationRepo.findById(conversationId).ifPresent(conv -> {
            conv.setLastMessage(message.getMessage());
            conv.setUpdatedAt(LocalDateTime.now());
            conversationRepo.save(conv);
        });

        // 3. Broadcast to both buyer and seller in this conversation
        messagingTemplate.convertAndSend(
                "/topic/messages/" + conversationId, saved
        );
    }
}