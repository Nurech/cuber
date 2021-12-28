package com.cuber.backend.controller;

import com.cuber.min2phase.example.Solver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebSocketController {

    // Create a Logger
    Logger logger = LoggerFactory.getLogger(WebSocketController.class);


    @MessageMapping("/solution")
    @SendTo("/topic/messages")
    public String send(String message) throws Exception {
        logger.info(String.valueOf(message));
        String solution = Solver.simpleSolve(message);
        logger.info(String.valueOf(solution));
        return solution;
    }
}
