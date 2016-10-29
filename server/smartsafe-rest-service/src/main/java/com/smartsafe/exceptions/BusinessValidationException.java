package com.smartsafe.exceptions;

public class BusinessValidationException extends RuntimeException {
	private static final long serialVersionUID = 1788371870033467694L;
	
	public BusinessValidationException() {
		super();
	}
	
	public BusinessValidationException(String msg) {
		super(msg);
	}
	
	public BusinessValidationException(Throwable cause) {
		super(cause);
	}
}
