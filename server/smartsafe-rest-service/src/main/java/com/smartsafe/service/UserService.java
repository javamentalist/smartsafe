package com.smartsafe.service;

import com.smartsafe.entity.SmartsafeUser;

public interface UserService {
	 SmartsafeUser createUser(String userId, String userPassword, String publicKey);
	 
	 SmartsafeUser findByEthAddress(String ethAddress);
}
