package com.smartsafe.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "USER")
@Getter
@Setter
public class SmartsafeUser implements Serializable {
	
	private static final long serialVersionUID = 5999372319856040119L;

	@Id
	@Column(name = "ethaddress")
	private String ethAddress;

	@Column(name = "dboxtoken", nullable = false)
    private String dboxToken;
    
    @Column(name = "pubkey", nullable = false)
    private String pubKey;
    
    protected SmartsafeUser() {}
    
    public SmartsafeUser(String ethAddress) {
    	this.ethAddress = ethAddress;
    }
}