package com.smartsafe.dto.fixtures;

import com.smartsafe.dto.SmartsafeUserDto;

public class SmartsafeUserDtoFixtures {
	
	private static final String VALID_ETHADDRESS = "89b44e4d3c81ede05d0f5de8d1a68f754d73d997";
	private static final String VALID_DBOXTOKEN = "ri6468xdAxBBAAAAAABBSfLOZ2e8UAnJ0otFI8V6_whVrN7fe00kBhvH39_rday3";
	private static final String VALID_PUBKEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAe1mCeQtA59PeIYPgsf25mmUcccF3byXBv6cW+b2mi3thvmYkTIYqjyrJmuPbTy+TIPByXU7tT0N7tORmN6OnzCCXXk2UgX8J6Kf7TwSNhLKPMuOlTYZdc2AkTRywoAuFjM2eBczfjMuBZu80vaVPUyD+adTQoY8MoJihwHUjqwIDAQAB";
	
	private static final String BAD_ETHADDRESS = "de8d1a68f754d73d997";


	public static SmartsafeUserDto validUser() {
		SmartsafeUserDto dto = new SmartsafeUserDto();
		dto.setEthAddress(VALID_ETHADDRESS);
		dto.setDboxToken(VALID_DBOXTOKEN);
		dto.setPubKey(VALID_PUBKEY);
		return dto;
	}
	
	public static SmartsafeUserDto userWithBadAddress() {
		SmartsafeUserDto dto = new SmartsafeUserDto();
		dto.setEthAddress(BAD_ETHADDRESS);
		dto.setDboxToken(VALID_DBOXTOKEN);
		dto.setPubKey(VALID_PUBKEY);
		return dto;
	}
	
	public static SmartsafeUserDto userWithNoAddress() {
		SmartsafeUserDto dto = new SmartsafeUserDto();
		dto.setDboxToken(VALID_DBOXTOKEN);
		dto.setPubKey(VALID_PUBKEY);
		return dto;
	}
	
	private SmartsafeUserDtoFixtures() {}
}
