package com.cuber.backend;

import com.cuber.min2phase.src.Search;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);

        // Init min2phase cube Solver ahead of time with server start-up
        Search.init();
    }

}
