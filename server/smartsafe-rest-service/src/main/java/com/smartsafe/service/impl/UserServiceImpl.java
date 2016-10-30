package com.smartsafe.service.impl;

import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartsafe.dao.UserRepository;
import com.smartsafe.entity.SmartsafeUser;
import com.smartsafe.exceptions.DuplicateUserException;
import com.smartsafe.exceptions.NoSuchUserException;
import com.smartsafe.service.UserService;


@Service
@Transactional
public class UserServiceImpl implements UserService {
	
	private static Logger log = LoggerFactory.getLogger(UserServiceImpl.class.getName());
	
	@Autowired
	private UserRepository userRepository;

	public SmartsafeUser createUser(SmartsafeUser user)  {
		String ethAddress = user.getEthAddress();
		SmartsafeUser existingUser = findByEthAddress(ethAddress);
		if (existingUser != null) {
			log.info("Attempted to create user with already registered Ethereum address {}.", ethAddress);
			throw new DuplicateUserException(ethAddress);
		}
		
		return userRepository.save(user);
	}

	@Override
	public SmartsafeUser findByEthAddress(String ethAddress) {
		return userRepository.findOne(ethAddress);
	}

	@Override
	public SmartsafeUser findExistingUserByEthAddress(String ethAddress) {
		SmartsafeUser existingUser = findByEthAddress(ethAddress);
		if (existingUser == null) {
			log.info("Attempted to request details of non-existing user with Ethereum address {}.", ethAddress);
			throw new NoSuchUserException(ethAddress);
		}
		
		return existingUser;
	}
}
