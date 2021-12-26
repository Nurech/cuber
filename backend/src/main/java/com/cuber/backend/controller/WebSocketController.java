package com.cuber.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
public class WebSocketController implements Runnable {

    @Autowired
    private SimpMessagingTemplate template;

    public void startWebSocket() {
        new Thread(this).start();
    }

    @PostConstruct
    public void postConstruct() {
        System.out.println("Start websocket");
        startWebSocket();
    }

    @Override
    public void run() {
        int data = 10;
        while (true) {
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            template.convertAndSend("/topic/hello", data);
        }
    }
}
