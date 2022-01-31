package com.cuber.backend.controller;

import com.cuber.min2phase.example.Solver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

import javax.websocket.OnMessage;
import java.io.Reader;
import java.util.Objects;

@RestController
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate template;

    // Create a Logger
    Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    @MessageMapping("/solution")
    public void getSolution(@Header String token, String message) throws Exception {
        String solution = Solver.simpleSolve(message);
        template.convertAndSend("/topic/solutions/" + token, solution);
    }

    @MessageMapping("/lobby")
    public void getLobby(@Header String token) throws Exception {
        logger.info(String.valueOf(token));
        String lobby = "123";
        template.convertAndSend("/topic/lobbies/" + token, lobby);
    }

    @MessageMapping("/scan")
    public void sendScan(@Header String token, String data) throws Exception {
//        logger.info(String.valueOf(token));
        if (Objects.equals(token, "robot")) {
            logger.info(String.valueOf(data));
        }
        template.convertAndSend("/topic/scan", data);
    }
}
