package alisa.smallokr.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.alisa.Util.JwtUtil;
import com.alisa.Util.Result;
import com.alisa.Util.UUIDTool;

import alisa.smallokr.entity.Todo;
import alisa.smallokr.service.TodoService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

@RequestMapping("/api/v1/todo")
@RestController
public class TodoController {
    @Autowired
    private TodoService todoService;

    @PostMapping("/add")
    public Result<Boolean> addTodo(@RequestBody Todo todo, HttpServletRequest request) {
        var token = request.getHeader("Authorization").substring(7);
        var userId = JwtUtil.extractClaim(token, new Function<Claims, String>() {
            @Override
            public String apply(Claims claims) {
                return (String) claims.get("userId"); // 假设自定义声明为 userId
            }
        });

        if (todo.getId() != null && !todo.getId().equals("")) {
        } else {
            todo.setId(UUIDTool.getUUID());
        }
        todo.setUserId(userId);
        boolean res = todoService.saveTodo(todo);
        return new Result<>(res);
    }

    @DeleteMapping("delete")
    public Result<Boolean> deleteTodo(String todoId) {
        boolean res = todoService.deleteTodo(todoId);
        return new Result<>(res);
    }

    @PutMapping("update")
    public Result<Boolean> updateTodo(Todo todo) {
        boolean res = todoService.updateTodo(todo);
        return new Result<>(res);
    }

    @GetMapping("get")
    public Result<List<Todo>> get(String userId, HttpServletRequest request) {
        var token = request.getHeader("Authorization").substring(7);
        if (userId == null) {
            userId = JwtUtil.extractClaim(token, new Function<Claims, String>() {
                @Override
                public String apply(Claims claims) {
                    return (String) claims.get("userId"); // 假设自定义声明为 userId
                }
            });
        }
        var todo = todoService.findTodoByUser(userId);
        return new Result<>(todo);
    }
}
