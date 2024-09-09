package alisa.smallokr.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import alisa.smallokr.entity.TodoRepeat;

@Mapper
public interface TodoRepeatMapper {
    public List<TodoRepeat> getRepeats(String todoId);

    public boolean addRepeat(TodoRepeat todoRepeat);

    public boolean deleteRepeat(String todoRepeatId);
}
