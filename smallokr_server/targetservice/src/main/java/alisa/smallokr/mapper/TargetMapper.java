package alisa.smallokr.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import alisa.smallokr.POJO.Target;

@Mapper
public interface TargetMapper {

    @Insert("insert into tb_targets(target_name,target_description) values(#{name},#{description})")
    @Options(useGeneratedKeys = true, keyProperty = "id")

    boolean addTarget(Target target);

    @Delete("delete from tb_targets where target_id=#{targetId}")
    boolean deleteTarget(long targetId);

    @Update("update tb_targets set target_name=#{name}, target_description=#{description}")
    boolean updateTarget(Target target);

    @Select("select * from tb_targets where id=#{targetId}")
    @Results(id = "targetMap", value = {
            @Result(property = "id", column = "target_id"),
            @Result(property = "targetGroupId", column = "target_groupId"),
            @Result(property = "name", column = "target_name"),
            @Result(property = "description", column = "target_description")
    })
    Target findTargetById(long targetId);

    @Select("select * from tb_targets")
    @Results(id = "targetMap2", value = {
            @Result(property = "id", column = "target_id"),
            @Result(property = "targetGroupId", column = "target_groupId"),
            @Result(property = "name", column = "target_name"),
            @Result(property = "description", column = "target_description")
    })
    List<Target> findAll();
}
