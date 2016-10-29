package com.smartsafe.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.smartsafe.dto.SmartsafeUserDto;
import com.smartsafe.entity.SmartsafeUser;
import com.smartsafe.service.UserService;

@RestController
public class RegistrationController {

    @Autowired
    private UserService userService;
    
    @RequestMapping(name = "/signup", method = { RequestMethod.POST })
    public void signup(@Valid @RequestBody SmartsafeUserDto userDto) {
    	SmartsafeUser user = new SmartsafeUser(userDto.getEthAddress());
    	user.setDboxToken(userDto.getDboxToken());
    	user.setPubKey(userDto.getPubKey());
    		
    	userService.createUser(user);
    }
}
	