package alisa.smallokr.mapper;

import org.apache.ibatis.annotations.Mapper;

import alisa.smallokr.entity.User;

@Mapper
public interface UserMapper {
    User findUserByName(String name);
    boolean saveUser(User user);
}
