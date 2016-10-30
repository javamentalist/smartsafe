package com.smartsafe.controller;

import static com.smartsafe.controller.TestUtils.JSON_CONTENT_TYPE;
import static com.smartsafe.controller.TestUtils.toJson;
import static com.smartsafe.dto.fixtures.SmartsafeUserDtoFixtures.userWithBadAddress;
import static com.smartsafe.dto.fixtures.SmartsafeUserDtoFixtures.userWithNoAddress;
import static com.smartsafe.dto.fixtures.SmartsafeUserDtoFixtures.validUser;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.smartsafe.TestConfiguration;
import com.smartsafe.dto.SmartsafeUserDto;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {TestConfiguration.class})
@WebAppConfiguration
public class RegistrationControllerTest {
	
	    @Autowired
	    private WebApplicationContext webApplicationContext;

	    private MockMvc mockMvc;

	    @Before
	    public void setup() {
	        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
	    }

	    @Test
	    public void shouldSignupSuccessfully() throws Exception {
	    	SmartsafeUserDto newUser = validUser();
	        
	        mockMvc
	        	.perform(post("/signup")
	                	.contentType(JSON_CONTENT_TYPE)
	                	.content(toJson(newUser)))
	            .andExpect(status().isCreated());
	    }
	    
	    @Test
	    public void shouldReturnClientErrorWhenPassingUserWithBadlyFormedAddress() throws Exception {
	    	SmartsafeUserDto newUser = userWithBadAddress();
	    	
	    	  mockMvc
	        	.perform(post("/signup")
	                	.contentType(JSON_CONTENT_TYPE)
	                	.content(toJson(newUser)))
	            .andExpect(status().is4xxClientError());
	    }
	    
	    @Test
	    public void shouldReturnClientErrorWhenPassingUserWithMissingAddress() throws Exception {
	    	SmartsafeUserDto newUser = userWithNoAddress();
	    	
	    	  mockMvc
	        	.perform(post("/signup")
	                	.contentType(JSON_CONTENT_TYPE)
	                	.content(toJson(newUser)))
	            .andExpect(status().is4xxClientError());
	    }
}
