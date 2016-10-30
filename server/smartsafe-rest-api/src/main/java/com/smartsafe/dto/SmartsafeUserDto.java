package com.smartsafe.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SmartsafeUserDto {

	@NotNull
	@Pattern(regexp = "^[0-9a-f]{40}$")
	private String ethAddress;
	@NotNull
	@Pattern(regexp = "\\S{64}")
    private String dboxToken;
	@NotNull
	@Size(min = 216, max = 216)
    private String pubKey;
}
