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
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MessageService {

    @Autowired
    private SimpMessagingTemplate template;

    // Create a Logger
    Logger logger = LoggerFactory.getLogger(MessageService.class);

    Set<String> connectedUsers = Collections.newSetFromMap(new ConcurrentHashMap<String, Boolean>());
    Map<Integer, Set<String>> activeLobbies = new HashMap<Integer, Set<String>>();

    @EventListener(SessionConnectEvent.class)
    public void handleWebsocketConnectListner(SessionConnectEvent event) {
        logger.info("Received a new web socket connection");
        logger.info(String.valueOf(event));
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        connectedUsers.add(sha.getSessionId());
        addUserToLobby(sha.getSessionId());
        template.convertAndSend("/topic/active-connections/", connectedUsers.size());
    }

    @EventListener(SessionSubscribeEvent.class)
    public void handleWebsocketSubscribeEvent(SessionSubscribeEvent event) {
        logger.info("Received a subscribe");
        logger.info(String.valueOf(event));
    }

    @EventListener(SessionDisconnectEvent.class)
    public void handleWebsocketDisconnectListner(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        connectedUsers.remove(sha.getSessionId());
        logger.info("A web socket connection was closed");
        removeUserFromLobby(sha.getSessionId());
        template.convertAndSend("/topic/active-connections/", connectedUsers.size());
    }

    public void addUserToLobby(String sessionId) {
        logger.info("userToLoby");
        logger.info(sessionId);

        if (activeLobbies.size() == 0) {
            activeLobbies.put(0, new HashSet<String>(Collections.singleton(sessionId)));
            return;
        }

        int index = 0;
        for (Map.Entry<Integer, Set<String>> entry : activeLobbies.entrySet()) {
            index++;
            if (entry.getValue().size() < 3) {
                entry.getValue().add(sessionId);
                return;
            } else if (activeLobbies.get(index) == null) {
                activeLobbies.put(index, new HashSet<String>(Collections.singleton(sessionId)));
                return;
            } else if (activeLobbies.get(index).size() < 3) {
                activeLobbies.get(index).add(sessionId);
                return;
            }
        }
        logger.info(String.valueOf(activeLobbies));
    }

    public void removeUserFromLobby(String sessionId) {
        if (sessionId == null) return;
        for (Map.Entry<Integer, Set<String>> entry : activeLobbies.entrySet()) {
            entry.getValue().remove(sessionId);
            if (entry.getValue().size() == 0) {
                activeLobbies.remove(entry.getKey());
            }
        }
        logger.info(String.valueOf(activeLobbies));
    }
}
