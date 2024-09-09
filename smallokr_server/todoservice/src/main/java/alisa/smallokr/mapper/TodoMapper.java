package alisa.smallokr.mapper;

import java.time.LocalDateTime;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import alisa.smallokr.entity.Todo;
import alisa.smallokr.vo.TodoVo;

@Mapper
public interface TodoMapper {
    boolean saveTodo(Todo todo);

    boolean deleteTodo(String id);

    Todo findTodoById(String id);

    List<TodoVo> findTodoByUser(String id);

    List<TodoVo> getTodoByUserAndWeekDay(@Param("userId") String userId,@Param("date") LocalDateTime date,@Param("weekDay") String weekDay);
}
