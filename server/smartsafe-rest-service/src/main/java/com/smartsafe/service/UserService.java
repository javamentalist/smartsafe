package com.smartsafe.service;

import com.smartsafe.entity.SmartsafeUser;

public interface UserService {
	
	 SmartsafeUser createUser(SmartsafeUser user);
	 
	 SmartsafeUser findByEthAddress(String ethAddress);
	 
	 SmartsafeUser findExistingUserByEthAddress(String ethAddress);
}
