package alisa.smallokr.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

import alisa.smallokr.POJO.Test;

@Mapper
public interface TestMapper {
    @Insert("INSERT INTO test (id, name) VALUES (#{id},#{name})")
      @Options(useGeneratedKeys = true, keyProperty = "id")
    void add(Test test);
}
