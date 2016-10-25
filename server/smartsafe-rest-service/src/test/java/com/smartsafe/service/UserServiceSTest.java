package com.smartsafe.service;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import com.smartsafe.TestConfiguration;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {TestConfiguration.class})
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
