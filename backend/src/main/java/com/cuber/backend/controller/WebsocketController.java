package com.cuber.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebsocketController {

    private SimpMessagingTemplate template;

    @Autowired
    void WebSocketController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @MessageMapping("/send/message")
    public void sendMessage(String message) {
        System.out.println(message);
        this.template.convertAndSend("/message", message);
    }
}
