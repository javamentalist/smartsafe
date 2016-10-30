package com.smartsafe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.smartsafe.dto.SmartsafeUserDto;
import com.smartsafe.entity.SmartsafeUser;
import com.smartsafe.mapper.SmartsafeUserMapper;
import com.smartsafe.service.UserService;

@RestController
@RequestMapping(value = "/share")
public class SharingController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private SmartsafeUserMapper userMapper;
    
    @RequestMapping(value = "/{userAddress}", method = { RequestMethod.GET })
    public SmartsafeUserDto getUserDetails(@PathVariable String userAddress) {
    	SmartsafeUser user = userService.findExistingUserByEthAddress(userAddress);
    	return userMapper.userToUserDto(user);
    }
}
