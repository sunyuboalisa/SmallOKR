package alisa.smallokr.mapper;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;

import alisa.smallokr.entity.Todo;

@Mapper
public interface TodoMapper {
    boolean saveTodo(Todo todo);
    boolean deleteTodo(String todoId);
    Todo findTodoById(String id);
    List<Todo> findTodoByUser(String id);
}
