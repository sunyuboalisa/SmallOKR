package alisa.smallokr.mapper;

import org.apache.ibatis.annotations.Mapper;

import alisa.smallokr.entity.User;

@Mapper
public interface UserMapper {
    User findUserByID(String id);

    User findUserByName(String name);

    User findUserByEmail(String name);

    boolean saveUser(User user);
}
