package com.cuber.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MessageService {

    @Autowired
    private SimpMessagingTemplate template;

    // Create a Logger
    Logger logger = LoggerFactory.getLogger(MessageService.class);

    Set<String> mySet = Collections.newSetFromMap(new ConcurrentHashMap<String, Boolean>());

    @EventListener(SessionConnectEvent.class)
    public void handleWebsocketConnectListner(SessionConnectEvent event) {
        logger.info("Received a new web socket connection");
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        mySet.add(sha.getSessionId());
        template.convertAndSend("/topic/active-connections/", mySet.size());
    }

    @EventListener(SessionDisconnectEvent.class)
    public void handleWebsocketDisconnectListner(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        mySet.remove(sha.getSessionId());
        logger.info("A web socket connection was closed");
        template.convertAndSend("/topic/active-connections/", mySet.size());

    }

}
