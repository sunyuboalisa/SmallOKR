package alisa.smallokr.service;

import java.time.LocalDateTime;
import java.util.List;

import alisa.smallokr.entity.Todo;
import alisa.smallokr.entity.TodoRepeat;

public interface TodoService {
    boolean saveTodo(Todo todo);

    boolean deleteTodo(String todoId);

    boolean updateTodo(Todo todo);

    List<Todo> findTodoByUser(String userId);

    List<Todo> getTodoByUserAndWeekDay(String userId, LocalDateTime date, String weekDay);

    List<TodoRepeat> getRepeats(String todoId);

    boolean addRepeat(TodoRepeat todoRepeat);

    boolean deleteRepeat(String todoRepeatId);
}
