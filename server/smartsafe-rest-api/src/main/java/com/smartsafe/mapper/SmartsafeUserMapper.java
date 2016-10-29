package com.smartsafe.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.smartsafe.dto.SmartsafeUserDto;
import com.smartsafe.entity.SmartsafeUser;

@Mapper(componentModel = "spring")
public interface SmartsafeUserMapper {

	SmartsafeUserMapper INSTANCE = Mappers.getMapper( SmartsafeUserMapper.class );

	SmartsafeUser userDtoToUser(SmartsafeUserDto userDto); 
}	
