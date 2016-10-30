package com.smartsafe.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.smartsafe.dto.SmartsafeUserDto;
import com.smartsafe.entity.SmartsafeUser;

@Mapper(componentModel = "spring")
public abstract class SmartsafeUserMapper {

	@Autowired
	private PasswordEncoder passwordEncoder;
    
	public abstract SmartsafeUser userDtoToUser(SmartsafeUserDto userDto);
	
	@Mapping(target = "dboxToken", ignore = true)
	public abstract SmartsafeUserDto userToUserDto(SmartsafeUser user);
	
    @AfterMapping
    protected void hashToken(@MappingTarget SmartsafeUser result) {
    	result.setDboxToken(passwordEncoder.encode(result.getDboxToken()));
    }
}	
