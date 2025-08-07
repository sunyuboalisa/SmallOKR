package alisa.smallokr.controller;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.alisa.Util.JwtUtil;
import com.alisa.Util.Result;
import com.alisa.Util.UUIDTool;

import alisa.smallokr.entity.Todo;
import alisa.smallokr.entity.TodoRepeat;
import alisa.smallokr.service.TodoService;
import alisa.smallokr.vo.TodoVo;
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
    public Result<Boolean> deleteTodo(@RequestParam String todoId) {
        boolean res = todoService.deleteTodo(todoId);
        return new Result<>(res);
    }

    @PutMapping("update")
    public Result<Boolean> updateTodo(Todo todo) {
        boolean res = todoService.updateTodo(todo);
        return new Result<>(res);
    }

    @GetMapping("get")
    public Result<List<TodoVo>> get(String userId, HttpServletRequest request) {
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

    @GetMapping("getTodoByWeekDay")
    public Result<List<TodoVo>> getTodoByWeekDay(String userId,
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime date, HttpServletRequest request) {
        var token = request.getHeader("Authorization").substring(7);
        if (userId == null) {
            userId = JwtUtil.extractClaim(token, new Function<Claims, String>() {
                @Override
                public String apply(Claims claims) {
                    return (String) claims.get("userId"); // 假设自定义声明为 userId
                }
            });
        }

        DayOfWeek dayOfWeek = date.getDayOfWeek();

        // 创建英文到中文的映射
        Map<DayOfWeek, String> dayOfWeekMap = new HashMap<>();
        dayOfWeekMap.put(DayOfWeek.MONDAY, "星期一");
        dayOfWeekMap.put(DayOfWeek.TUESDAY, "星期二");
        dayOfWeekMap.put(DayOfWeek.WEDNESDAY, "星期三");
        dayOfWeekMap.put(DayOfWeek.THURSDAY, "星期四");
        dayOfWeekMap.put(DayOfWeek.FRIDAY, "星期五");
        dayOfWeekMap.put(DayOfWeek.SATURDAY, "星期六");
        dayOfWeekMap.put(DayOfWeek.SUNDAY, "星期天");
        String chineseDay = dayOfWeekMap.get(dayOfWeek);

        var todo = todoService.getTodoByUserAndWeekDay(userId, date, chineseDay);
        return new Result<>(todo);
    }

    @GetMapping("getRepeat")
    public Result<List<TodoRepeat>> getRepeat(String todoId) {
        var todoRepeats = todoService.getRepeats(todoId);
        return new Result<>(todoRepeats);

    }

    @PostMapping("addRepeat")
    public Result<Boolean> addRepeat(@RequestBody TodoRepeat todoRepeat) {
        todoRepeat.setTodoRepeatId(UUIDTool.getUUID());
        var result = todoService.addRepeat(todoRepeat);
        return new Result<>(result);
    }

    @DeleteMapping("deleteRepeat")
    public Result<Boolean> deleteRepeat(String todoRepeatId) {
        var result = todoService.deleteRepeat(todoRepeatId);
        return new Result<Boolean>(result);
    }

    @GetMapping("analysis")
    public void getAnalysis() {

    }
}
