package alisa.smallokr.service;

import alisa.smallokr.entity.User;

public interface UserService {
    User findUserById(String id);

    User loadUserByName(String name);

    User loadUserByEmail(String email);

    boolean saveUser(User user);
}
