package com.campus.placement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PlacementApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlacementApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  Smart Campus Placement System Backend Started! ");
        System.out.println("  API URL:       http://localhost:8080/api       ");
        System.out.println("  H2 Console:    http://localhost:8080/h2-console");
        System.out.println("=================================================");
    }
}
