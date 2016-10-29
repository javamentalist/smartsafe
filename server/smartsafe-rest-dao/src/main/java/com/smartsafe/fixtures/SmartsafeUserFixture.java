package com.smartsafe.fixtures;

import com.smartsafe.entity.SmartsafeUser;

public class SmartsafeUserFixture {
	private static final String TESTUSER_ETHADDRESS = "testAddress";
	private static final String TESTUSER_DBOXTOKEN = "testToken";
	private static final String TESTUSER_PUBLICKEY = "testKey";
	
	public static SmartsafeUser testUser() {
		SmartsafeUser user = new SmartsafeUser(TESTUSER_ETHADDRESS);
		user.setDboxToken(TESTUSER_DBOXTOKEN);
		user.setPubKey(TESTUSER_PUBLICKEY);
		return user;
	}
	
	private SmartsafeUserFixture() {}
}
