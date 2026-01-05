package alisa.smallokr.controller;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.alisa.model.UserContext;
import com.alisa.util.Result;
import com.alisa.util.UUIDTool;

import alisa.smallokr.entity.Todo;
import alisa.smallokr.entity.TodoRepeat;
import alisa.smallokr.service.TodoService;
import alisa.smallokr.vo.TodoVo;
import jakarta.servlet.http.HttpServletRequest;

@RequestMapping("/api/v1/todo")
@RestController
public class TodoController {
    @Autowired
    private TodoService todoService;

    @PostMapping("/add")
    public Result<Boolean> addTodo(@RequestBody Todo todo, HttpServletRequest request) {
        UserContext userContext = UserContext.get();
        String userId = userContext.getUserId();

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
        if (userId == null) {
            UserContext userContext = UserContext.get();
            userId = userContext.getUserId();
        }
        var todo = todoService.findTodoByUser(userId);
        return new Result<>(todo);
    }

    @GetMapping("getTodoByWeekDay")
    public Result<List<TodoVo>> getTodoByWeekDay(String userId,
            @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime date, HttpServletRequest request) {
        if (userId == null) {
            UserContext userContext = UserContext.get();
            userId = userContext.getUserId();
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
    public Result<Integer> addRepeat(@RequestBody List<TodoRepeat> todoRepeatList) {
        if (todoRepeatList == null || todoRepeatList.isEmpty()) {
            return new Result<>(0);
        }

        // 如果是新增记录，则生成 ID
        for (TodoRepeat repeat : todoRepeatList) {
            if (repeat.getTodoRepeatId() == null || repeat.getTodoRepeatId().trim().isEmpty()) {
                repeat.setTodoRepeatId(UUIDTool.getUUID());
            }
        }
        int affectedRows = todoService.addOrUpdateRepeat(todoRepeatList);

        return new Result<>(affectedRows);
    }

    @DeleteMapping("deleteRepeat")
    public Result<Integer> deleteRepeat(@RequestBody List<String> todoRepeatIds) {
        var result = todoService.deleteRepeat(todoRepeatIds);
        return new Result<Integer>(result);
    }

    @GetMapping("analysis")
    public void getAnalysis() {

    }
}
