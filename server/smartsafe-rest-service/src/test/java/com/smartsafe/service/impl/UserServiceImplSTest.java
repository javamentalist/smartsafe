package com.smartsafe.service.impl;

import static com.smartsafe.fixtures.SmartsafeUserFixture.testUser;
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
	
	@Autowired
	private UserService userService;
	
	@Test
	public void shouldCreateOrUpdateUser() {
		SmartsafeUser user = testUser();

		SmartsafeUser createdUser = userService.createUser(user);
		
		assertThat(userService.findByEthAddress(user.getEthAddress())).isEqualToComparingFieldByField(createdUser);
	}
}
