package com.smartsafe.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartsafe.entity.User;

public interface UserRepository extends JpaRepository<User, String> {	
}