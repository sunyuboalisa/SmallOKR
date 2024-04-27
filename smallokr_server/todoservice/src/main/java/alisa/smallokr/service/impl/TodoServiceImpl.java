package alisa.smallokr.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import alisa.smallokr.POJO.Todo;
import alisa.smallokr.mapper.TodoMapper;
import alisa.smallokr.service.TodoService;

@Service("TodoService")
public class TodoServiceImpl implements TodoService {
    @Autowired
    private TodoMapper todoMapper;

    @Override
    public boolean addTodo(Todo todo) {
        return todoMapper.addTodo(todo);
    }

    @Override
    public boolean deleteTodo(long todoId) {
        return todoMapper.deleteTodo(todoId);
    }

    @Override
    public boolean updateTodo(Todo todo) {
        return todoMapper.updateTodo(todo);
    }

    @Override
    public Todo findTodoById(long todoId) {
        return todoMapper.findTodoById(todoId);
    }

    @Override
    public List<Todo> getAllTodos() {
        return todoMapper.findAll();
    }

}
