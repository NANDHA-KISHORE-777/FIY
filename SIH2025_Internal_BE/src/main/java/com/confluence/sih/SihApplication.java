package com.confluence.sih;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SihApplication {

	public static void main(String[] args) {
		SpringApplication.run(SihApplication.class, args);
	}

}
