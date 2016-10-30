package com.smartsafe.service.impl;

import static com.smartsafe.fixtures.SmartsafeUserFixture.testUser;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.smartsafe.dao.UserRepository;
import com.smartsafe.entity.SmartsafeUser;
import com.smartsafe.exceptions.DuplicateUserException;
import com.smartsafe.exceptions.NoSuchUserException;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceImplTest {

	@InjectMocks
	private UserServiceImpl userService;
	
	@Mock
	private UserRepository userRepository;
	
	private ArgumentCaptor<SmartsafeUser> userCaptor;
	
	@Before
	public void setUp() {
		userCaptor = ArgumentCaptor.forClass(SmartsafeUser.class);
	}
	
	@Test
	public void shouldCallSaveWhenCreatingUser() {
		SmartsafeUser user = testUser();
		String userEthAddress = user.getEthAddress();
		
		userService.createUser(user);
	
		verify(userRepository).save(userCaptor.capture());
		assertThat(userCaptor.getValue().getEthAddress()).isEqualTo(userEthAddress);
	}
	
	@Test(expected = DuplicateUserException.class)
	public void shouldThrowExceptionWhenTryingToCreateUserWithAlreadyRegisteredAddress() {
		SmartsafeUser user = testUser();
		String userEthAddress = user.getEthAddress();
		when(userRepository.findOne(userEthAddress)).thenReturn(user);
		
		userService.createUser(user);
	}
	
	@Test
	public void shouldReturnUserDetailsOfRegisteredUser() {
		SmartsafeUser user = testUser();
		String userEthAddress = user.getEthAddress();
		when(userRepository.findOne(userEthAddress)).thenReturn(user);

		SmartsafeUser foundUser = userService.findExistingUserByEthAddress(userEthAddress);
		
		assertThat(foundUser).isEqualToComparingFieldByField(user);
	}
	
	@Test(expected = NoSuchUserException.class)
	public void shouldThrowExceptionWhenTryingToObtainNonExistingUserDetails() {
		SmartsafeUser user = testUser();
		String userEthAddress = user.getEthAddress();
		
		userService.findExistingUserByEthAddress(userEthAddress);
	}
}
