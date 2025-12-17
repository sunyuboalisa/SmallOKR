package alisa.smallokr.service;

import java.time.LocalDateTime;
import java.util.List;
import alisa.smallokr.entity.Todo;
import alisa.smallokr.entity.TodoRepeat;
import alisa.smallokr.vo.TodoVo;

public interface TodoService {
    boolean saveTodo(Todo todo);

    boolean deleteTodo(String todoId);

    boolean updateTodo(Todo todo);

    List<TodoVo> findTodoByUser(String userId);

    List<TodoVo> getTodoByUserAndWeekDay(String userId, LocalDateTime date, String weekDay);

    List<TodoRepeat> getRepeats(String todoId);

    int addOrUpdateRepeat(List<TodoRepeat> todoRepeat);

    int deleteRepeat(List<String> todoRepeatId);
}
