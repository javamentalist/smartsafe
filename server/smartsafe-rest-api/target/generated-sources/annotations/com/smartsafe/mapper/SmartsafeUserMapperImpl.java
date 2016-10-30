package com.smartsafe.mapper;

import com.smartsafe.dto.SmartsafeUserDto;
import com.smartsafe.entity.SmartsafeUser;
import javax.annotation.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2016-10-30T12:09:37+0200",
    comments = "version: 1.1.0.CR1, compiler: Eclipse JDT (IDE) 3.12.1.v20160829-0950, environment: Java 1.8.0_111 (Oracle Corporation)"
)
@Component
public class SmartsafeUserMapperImpl extends SmartsafeUserMapper {

    @Override
    public SmartsafeUser userDtoToUser(SmartsafeUserDto userDto) {
        if ( userDto == null ) {
            return null;
        }

        SmartsafeUser smartsafeUser = new SmartsafeUser();

        smartsafeUser.setDboxToken( userDto.getDboxToken() );
        smartsafeUser.setEthAddress( userDto.getEthAddress() );
        smartsafeUser.setPubKey( userDto.getPubKey() );

        hashToken( smartsafeUser );

        return smartsafeUser;
    }

    @Override
    public SmartsafeUserDto userToUserDto(SmartsafeUser user) {
        if ( user == null ) {
            return null;
        }

        SmartsafeUserDto smartsafeUserDto = new SmartsafeUserDto();

        smartsafeUserDto.setEthAddress( user.getEthAddress() );
        smartsafeUserDto.setPubKey( user.getPubKey() );

        return smartsafeUserDto;
    }
}
