package alisa.smallokr.mapper;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import alisa.smallokr.POJO.Todo;

@Mapper
public interface TodoMapper {
    boolean addTodo(Todo todo);
    boolean deleteTodo(long todoId);
    boolean updateTodo(Todo todo);
    Todo findTodoById(long id);
    List<Todo> findAll();
}
