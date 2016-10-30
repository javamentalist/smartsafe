package com.smartsafe.controller;

import static com.smartsafe.controller.TestUtils.JSON_CONTENT_TYPE;
import static com.smartsafe.controller.TestUtils.toJson;
import static com.smartsafe.dto.fixtures.SmartsafeUserDtoFixtures.validUser;
import static java.lang.String.format;
import static org.hamcrest.CoreMatchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
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
public class SharingControllerTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;
    
	private SmartsafeUserDto user = validUser();


    @Before
    public void setup() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        mockMvc
        	.perform(post("/signup")
                	.contentType(JSON_CONTENT_TYPE)
                	.content(toJson(user)))
            .andExpect(status().isCreated());
    }

    @Test
    public void shouldGetPublicKeySuccessfully() throws Exception {
        mockMvc
        	.perform(get(format("/share/%s", user.getEthAddress())))
            .andExpect(status().is2xxSuccessful())
            .andExpect(content().string(containsString(user.getPubKey())));
    }
}
