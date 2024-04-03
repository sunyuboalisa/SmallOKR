package alisa.smallokr.service;

import java.util.List;

import alisa.smallokr.POJO.Todo;

public interface TodoService {

    List<Todo> getAllTodos();
    boolean assignPlan(long planId);
    boolean addTodo(Todo todo);
}
