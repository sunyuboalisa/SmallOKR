package alisa.smallokr.mapper;

import java.time.LocalDateTime;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import alisa.smallokr.entity.Todo;

@Mapper
public interface TodoMapper {
    boolean saveTodo(Todo todo);

    boolean deleteTodo(String id);

    Todo findTodoById(String id);

    List<Todo> findTodoByUser(String id);

    List<Todo> getTodoByUserAndWeekDay(@Param("userId") String userId,@Param("date") LocalDateTime date,@Param("weekDay") String weekDay);
}
