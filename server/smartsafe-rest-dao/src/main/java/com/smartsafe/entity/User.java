package com.smartsafe.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class User implements Serializable {
	
	private static final long serialVersionUID = 5999372319856040119L;

	@Id
	@Column(name = "ethaddress")
	private String ethAddress;

	@Column(name = "dboxtoken", nullable = false)
    private String dboxToken;
    
    @Column(name = "pubkey", nullable = false)
    private String pubKey;
    
    protected User() {}
    
    public User(String ethAddress, String dboxToken) {
    	this.ethAddress = ethAddress;
    	this.dboxToken = dboxToken;
    }
    
    public String getEthAddress() {
		return ethAddress;
	}

	public void setEthAddress(String ethAddress) {
		this.ethAddress = ethAddress;
	}

	public String getDboxToken() {
		return dboxToken;
	}

	public void setDboxToken(String dboxToken) {
		this.dboxToken = dboxToken;
	}

	public String getPubKey() {
		return pubKey;
	}

	public void setPubKey(String pubKey) {
		this.pubKey = pubKey;
	}
}