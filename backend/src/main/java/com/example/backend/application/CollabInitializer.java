package com.example.backend.application;

import com.example.backend.domain.CollabEntity;
import com.example.backend.domain.RequirementEntity;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CollabInitializer implements CommandLineRunner {
    private final CollabService collabService;

    public CollabInitializer(CollabService collabService) {
        this.collabService = collabService;
    }

    @Override
    public void run(String... args) {
        if (collabService.all().isEmpty()) {
            CollabEntity collab1 = new CollabEntity("Nubchan", 1.5, 3);
            collab1.addRequirement(new RequirementEntity("subscribers", 3000));
            collab1.addRequirement(new RequirementEntity("streams", 10));
            collabService.add(collab1);

            CollabEntity collab2 = new CollabEntity("Nyanners",  2,2);
            collab2.addRequirement(new RequirementEntity("subscribers", 5000));
            collab2.addRequirement(new RequirementEntity("streams", 25));
            collabService.add(collab2);

            CollabEntity collab3 = new CollabEntity("Ironmouse", 3,5);
            collab3.addRequirement(new RequirementEntity("subscribers", 10000));
            collab3.addRequirement(new RequirementEntity("streams", 40));
            collabService.add(collab3);

            CollabEntity collab4 = new CollabEntity("Sameko Saba", 5 , 1);
            collab4.addRequirement(new RequirementEntity("subscribers", 500000));
            collab4.addRequirement(new RequirementEntity("streams", 70));
            collabService.add(collab4);
        }
    }
}