package com.smartsafe.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.smartsafe.dto.SmartsafeUserDto;
import com.smartsafe.entity.SmartsafeUser;
import com.smartsafe.mapper.SmartsafeUserMapper;
import com.smartsafe.service.UserService;

@RestController
public class RegistrationController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private SmartsafeUserMapper userMapper;
        
    @RequestMapping(name = "/signup", method = { RequestMethod.POST })
    @ResponseStatus(code = HttpStatus.CREATED)
    public void signup(@Valid @RequestBody SmartsafeUserDto userDto) {
    	SmartsafeUser user = userMapper.userDtoToUser(userDto);	
    	userService.createUser(user);
    }
}
	