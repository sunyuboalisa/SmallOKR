package alisa.smallokr.service.impl;

import java.util.List;
import org.springframework.stereotype.Service;
import alisa.smallokr.POJO.Todo;
import alisa.smallokr.service.TodoService;

@Service("TodoService")
public class TodoServiceImpl implements TodoService{

    @Override
    public List<Todo> getAllTodos() {
        throw new UnsupportedOperationException("Unimplemented method 'getAllTodos'");
    }

    @Override
    public boolean assignPlan(long planId) {
        throw new UnsupportedOperationException("Unimplemented method 'assignPlan'");
    }

    @Override
    public boolean addTodo(Todo todo) {
        throw new UnsupportedOperationException("Unimplemented method 'addTodo'");
    }
    
}
