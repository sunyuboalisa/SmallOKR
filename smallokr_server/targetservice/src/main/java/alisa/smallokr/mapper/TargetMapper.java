package alisa.smallokr.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import alisa.smallokr.POJO.Target;

@Mapper
public interface TargetMapper {
    @Select("select * from tb_targets where id=#{targetId}")
    Target findTargetById(long targetId);

    @Insert("insert into tb_targets(target_name,target_description) values(#{name},#{description})")
    boolean addTarget(Target target);

    @Select("select * from tb_targets")
    @Options(useGeneratedKeys = true, keyProperty = "target_Id")
    @Results(id = "targetMap", value = {
            @Result(property = "id", column = "target_id"),
            @Result(property = "targetGroupId", column = "target_groupId"),
            @Result(property = "name", column = "target_name"),
            @Result(property = "description", column = "target_description")
    })
    List<Target> getAllTargets();
}
