package com.smartsafe.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SmartsafeUserDto {

	@NotNull
	@Size(min = 40, max = 40)
	private String ethAddress;
	@NotNull
	@Size(min = 64, max = 64)
	@JsonProperty(access = Access.WRITE_ONLY)
    private String dboxToken;
	@NotNull
	@Size(min = 216, max = 216)
    private String pubKey;
}
