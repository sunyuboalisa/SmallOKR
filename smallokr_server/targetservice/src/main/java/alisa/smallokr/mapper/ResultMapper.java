package alisa.smallokr.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.annotations.Results;
import alisa.smallokr.POJO.Result;

@Mapper
public interface ResultMapper {
        @Insert("insert into tb_results(reuslt_name,result_value,target_id) values(#{name},#{value},#{targetId})")
        @Options(useGeneratedKeys = true, keyProperty = "id")
        boolean addResult(Result result);

        @Delete("delete from tb_results where result_id=#{resultId}")
        boolean deleteResult(long resultId);

        @Update("update tb_results set result_name=#{name}, result_value=#{value} target_id=#{targetId}")
        boolean updateResult(Result result);

        @Select("select * from tb_results where id=#{resultId}")
        @Results(id = "resultMap", value = {
                        @org.apache.ibatis.annotations.Result(property = "id", column = "result_id"),
                        @org.apache.ibatis.annotations.Result(property = "targetId", column = "target_id"),
                        @org.apache.ibatis.annotations.Result(property = "name", column = "result_name"),
                        @org.apache.ibatis.annotations.Result(property = "value", column = "result_value")
        })
        Result findResultById(long resultId);

        @Select("select * from tb_results")
        @Results(id = "resultMap2", value = {
                        @org.apache.ibatis.annotations.Result(property = "id", column = "result_id"),
                        @org.apache.ibatis.annotations.Result(property = "targetId", column = "target_id"),
                        @org.apache.ibatis.annotations.Result(property = "name", column = "result_name"),
                        @org.apache.ibatis.annotations.Result(property = "value", column = "result_value")
        })
        List<Result> findAll();
}
