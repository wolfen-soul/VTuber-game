package com.example.backend.application;

import com.example.backend.domain.AgencyEntity;
import com.example.backend.domain.RequirementEntity;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AgencyInitializer implements CommandLineRunner {
    private final AgencyService agencyService;

    public AgencyInitializer(AgencyService agencyService) {
        this.agencyService = agencyService;
    }

    @Override
    public void run(String... args) {
        if (agencyService.all().isEmpty()) {
            AgencyEntity agency1 = new AgencyEntity("Fru-Live", 500 , 500,  0.03);
            agency1.addRequirement(new RequirementEntity("subscribers", 1000));
            agency1.addRequirement(new RequirementEntity("streams", 5));
            agency1.addRequirement(new RequirementEntity("average_online", 150));
            agencyService.add(agency1);

            AgencyEntity agency2 = new AgencyEntity("SCAM", 1000 , 1500,  0.05);
            agency2.addRequirement(new RequirementEntity("subscribers", 3500));
            agency2.addRequirement(new RequirementEntity("streams", 15));
            agency2.addRequirement(new RequirementEntity("average_online", 500));
            agencyService.add(agency2);

            AgencyEntity agency3 = new AgencyEntity("Kaibutsu", 3000 , 3000,  0.08);
            agency3.addRequirement(new RequirementEntity("subscribers", 6000));
            agency3.addRequirement(new RequirementEntity("streams", 30));
            agency3.addRequirement(new RequirementEntity("average_online", 750));
            agencyService.add(agency3);

            AgencyEntity agency4 = new AgencyEntity("WePlanet", 5000 , 5000,  0.1);
            agency4.addRequirement(new RequirementEntity("subscribers", 15000));
            agency4.addRequirement(new RequirementEntity("streams", 50));
            agency4.addRequirement(new RequirementEntity("average_online", 1350));
            agencyService.add(agency4);

            AgencyEntity agency5 = new AgencyEntity("VShojo", 8500 , 15000,  0.2);
            agency5.addRequirement(new RequirementEntity("subscribers", 50000));
            agency5.addRequirement(new RequirementEntity("streams", 75));
            agency5.addRequirement(new RequirementEntity("average_online", 2500));
            agencyService.add(agency5);

            AgencyEntity agency6 = new AgencyEntity("Hololive", 40000, 30000, 0.4);
            agency6.addRequirement(new RequirementEntity("subscribers", 100000));
            agency6.addRequirement(new RequirementEntity("streams", 120));
            agency6.addRequirement(new RequirementEntity("average_online", 6000));
            agencyService.add(agency6);
        }
    }
}