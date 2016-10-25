package com.smartsafe;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = {"com.smartsafe.dao"})
@EntityScan(basePackages = {"com.smartsafe.entity"})
@EnableAutoConfiguration
@ComponentScan(basePackages = {"com.smartsafe"})
public class TestConfiguration {

}
