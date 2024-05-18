package alisa.smallokr.service;

import java.util.List;

import alisa.smallokr.entity.Todo;

public interface TodoService {
    boolean saveTodo(Todo todo);

    boolean deleteTodo(String todoId);

    boolean updateTodo(Todo todo);

    List<Todo> findTodoByUser(String userId);
}
