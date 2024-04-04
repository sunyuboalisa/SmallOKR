package alisa.smallokr.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import alisa.smallokr.POJO.Todo;
import alisa.smallokr.service.TodoService;

@RequestMapping("api/v1/todo/")
@RestController
public class TodoController {
    @Autowired
    private TodoService todoService;

    @GetMapping("getAll")
    public List<Todo> getAlTodos() {
        List<Todo> todos = todoService.getAllTodos();
        return todos;
    }

    @PostMapping("add")
    public boolean addTodo(Todo todo) {
        boolean res = todoService.addTodo(todo);
        return res;
    }

    @PutMapping("assignPlan")
    public boolean assignPlan(long palnId) {
        boolean res = todoService.assignPlan(palnId);
        return res;
    }
}
