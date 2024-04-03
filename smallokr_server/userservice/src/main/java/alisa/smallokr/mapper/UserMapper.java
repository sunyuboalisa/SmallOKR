package alisa.smallokr.mapper;

import alisa.smallokr.POJO.User;

public interface UserMapper {
    User findUserByName(String name);
}
