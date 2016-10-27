package com.smartsafe.service;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartsafe.dao.UserRepository;
import com.smartsafe.entity.User;

@Service
@Transactional
public class UserService {
	
	@Autowired
	private UserRepository userRepository;

	public User createUser(String userId, String userPassword, String publicKey) {	
		User user = new User(userId, userPassword);
		user.setPubKey(publicKey);
		return userRepository.save(user);
	}
}
