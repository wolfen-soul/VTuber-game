package com.example.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/* TODO:
*    try Autowired
*    mappers into services
*    recreate apis correctly:
*      CollabController - Post(check) -> Get(status)
*      Agency/CollabController - Post(remove) -> Delete()
*    refactor some time
*/
@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}