package com.smartsafe.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartsafe.entity.SmartsafeUser;

public interface UserRepository extends JpaRepository<SmartsafeUser, String> {	
}