package com.smartsafe.service.impl;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.smartsafe.entity.SmartsafeUser;
import com.smartsafe.inversion.UserDetailsServiceProvider;
import com.smartsafe.service.UserService;

@Component
public class UserDetailsServiceProviderImpl implements UserDetailsServiceProvider {

	@Autowired
	private UserService userService;

	@Override
	public UserDetails loadUserByUsername(String ethAddress) throws UsernameNotFoundException {
		SmartsafeUser user = userService.findByEthAddress(ethAddress);
		if (user == null) {
			throw new UsernameNotFoundException(String.format("User with Ethereum address %s not found in the system", ethAddress));
		}
		return new User(ethAddress, user.getDboxToken(), Arrays.<GrantedAuthority>asList(() -> "ROLE_USER"));
	}
}
