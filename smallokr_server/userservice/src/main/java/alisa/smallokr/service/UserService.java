package alisa.smallokr.service;

import alisa.smallokr.entity.User;

public interface UserService {
    User loadUserByName(String name);
    boolean saveUser(User user);
} 
