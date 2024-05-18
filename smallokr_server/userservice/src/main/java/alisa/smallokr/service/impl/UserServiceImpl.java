package alisa.smallokr.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import alisa.smallokr.entity.User;
import alisa.smallokr.mapper.UserMapper;
import alisa.smallokr.service.UserService;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public User loadUserByName(String name) {
        return userMapper.findUserByName(name);
    }

    public boolean saveUser(User user){
        return userMapper.saveUser(user);
    }

}
