package com.smartsafe.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.smartsafe.dao.UserRepository;
import com.smartsafe.entity.User;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {
	
	private static final String USER_ADDRESS = "testAddress";
	private static final String USER_PASSWORD = "testPassword";
	private static final String USER_KEY = "testKey";

	@InjectMocks
	private UserService userService;
	
	@Mock
	private UserRepository userRepository;
	
	@Test
	public void shouldCallCreateOrUpdateUser() {
		userService.createUser(USER_ADDRESS, USER_PASSWORD, USER_KEY);
	
		ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
		verify(userRepository).save(userCaptor.capture());
		assertThat(userCaptor.getValue().getEthAddress()).isEqualTo(USER_ADDRESS);
	}
}
