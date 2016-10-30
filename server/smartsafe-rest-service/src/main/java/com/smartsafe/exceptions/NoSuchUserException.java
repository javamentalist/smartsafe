package com.smartsafe.exceptions;

import static java.lang.String.format;

public class NoSuchUserException extends BusinessValidationException {
	private static final long serialVersionUID = -3815934676936673052L;
	
	public NoSuchUserException(String userAddress) {
		super(format("User with address %s is not registered in the system", userAddress));
	}
}
