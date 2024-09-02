package alisa.smallokr.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import alisa.smallokr.entity.Todo;
import alisa.smallokr.mapper.TodoMapper;
import alisa.smallokr.service.TodoService;

@Service
public class TodoServiceImpl implements TodoService {
    @Autowired
    private TodoMapper todoMapper;

    @Override
    public boolean saveTodo(Todo todo) {
        return todoMapper.saveTodo(todo);
    }

    @Override
    public boolean deleteTodo(String todoId) {
        return todoMapper.deleteTodo(null);
    }

    @Override
    public boolean updateTodo(Todo todo) {
        throw new UnsupportedOperationException("Unimplemented method 'updateTodo'");
    }

    @Override
    public List<Todo> findTodoByUser(String userId) {
        return todoMapper.findTodoByUser(userId);
    }

}
