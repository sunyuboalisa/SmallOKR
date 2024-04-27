package alisa.smallokr.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import alisa.smallokr.POJO.Todo;
import alisa.smallokr.service.TodoService;

@RequestMapping("api/v1/todo/")
@RestController
public class TodoController {
    @Autowired
    private TodoService todoService;

    @PostMapping("add")
    public boolean addTodo(@RequestBody Todo todo) {
        boolean res = todoService.addTodo(todo);
        return res;
    }

    @DeleteMapping("delete")
    public boolean deleteTodo(long todoId) {
        boolean res = todoService.deleteTodo(todoId);
        return res;
    }

    @PutMapping("update")
    public boolean updateTodo(Todo todo) {
        boolean res = todoService.updateTodo(todo);
        return res;
    }

    @GetMapping("get")
    public Todo get(long todoId) {
        var todo = todoService.findTodoById(todoId);
        return todo;
    }

    @GetMapping("getAll")
    public List<Todo> getAlTodos() {
        List<Todo> todos = todoService.getAllTodos();
        return todos;
    }
}
