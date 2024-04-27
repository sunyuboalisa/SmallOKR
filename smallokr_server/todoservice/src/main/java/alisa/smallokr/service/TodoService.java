package alisa.smallokr.service;

import java.util.List;

import alisa.smallokr.POJO.Todo;

public interface TodoService {
    boolean addTodo(Todo todo);

    boolean deleteTodo(long todoId);

    boolean updateTodo(Todo todo);

    Todo findTodoById(long todoId);

    List<Todo> getAllTodos();
}
