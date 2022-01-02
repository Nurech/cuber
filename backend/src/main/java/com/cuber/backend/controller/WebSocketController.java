package com.cuber.backend.controller;

import com.cuber.min2phase.example.Solver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate template;

    // Create a Logger
    Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    @MessageMapping("/solution")
    public void send(@Header String token, String message) throws Exception {
        logger.info(String.valueOf(message));
        logger.info(String.valueOf(token));
        String solution = Solver.simpleSolve(message);
        logger.info(String.valueOf(solution));
        template.convertAndSend("/topic/solutions/" + token, solution);
    }
}
