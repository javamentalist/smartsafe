package com.smartsafe.service.impl;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartsafe.dao.UserRepository;
import com.smartsafe.entity.SmartsafeUser;
import com.smartsafe.service.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepository userRepository;

	public SmartsafeUser createUser(String userId, String userPassword, String publicKey) {	
		SmartsafeUser user = new SmartsafeUser(userId, userPassword);
		user.setPubKey(publicKey);
		return userRepository.save(user);
	}

	@Override
	public SmartsafeUser findByEthAddress(String ethAddress) {
		return userRepository.findOne(ethAddress);
	}
}
