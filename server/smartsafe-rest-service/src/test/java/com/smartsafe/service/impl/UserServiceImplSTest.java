package com.smartsafe.service.impl;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import com.smartsafe.TestConfiguration;
import com.smartsafe.entity.SmartsafeUser;
import com.smartsafe.service.UserService;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {TestConfiguration.class})
public class UserServiceImplSTest {
	
	private static final String USER_ADDRESS = "testAddress";
	private static final String USER_PASSWORD = "testPassword";
	private static final String USER_KEY = "testKey";
	
	@Autowired
	private UserService userService;
	
	@Test
	public void shouldCreateOrUpdateUser() {
		SmartsafeUser user = userService.createUser(USER_ADDRESS, USER_PASSWORD, USER_KEY);
		
		assertThat(user.getEthAddress()).isEqualTo(USER_ADDRESS);
	}
}
