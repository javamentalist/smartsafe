package com.smartsafe.service;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserServiceSTest {
	
	@Autowired
	private UserService userService;
	
	@Before
	public void setUp() {
		
	}

	@Test
	public void test() {
		userService.createUser("testUser", "testPassword", "testKey");
	}

	@After
	public void tearDown() {
		
	}
}
