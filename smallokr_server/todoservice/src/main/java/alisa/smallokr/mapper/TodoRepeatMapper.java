package alisa.smallokr.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import alisa.smallokr.entity.TodoRepeat;

@Mapper
public interface TodoRepeatMapper {
    public List<TodoRepeat> getRepeats(String todoId);

    public int addOrUpdateRepeat(@Param("list") List<TodoRepeat> todoRepeatList);

    public int deleteRepeat(@Param("list") List<String> todoRepeatIds);
}
