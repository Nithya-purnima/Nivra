package com.project.nivra.repository;

import com.project.nivra.model.Role;
import com.project.nivra.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByVerifiedFalse();

    List<User> findByRoleAndVerified(Role role, boolean verified);
}