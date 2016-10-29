package com.smartsafe.exceptions;

import static java.lang.String.format;

public class DuplicateUserException extends BusinessValidationException {
	private static final long serialVersionUID = 8382755061286100455L;
	
	public DuplicateUserException(String userAddress) {
		super(format("User with address %s has already been registered in the system", userAddress));
	}
}
