package alisa.smallokr.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import alisa.smallokr.entity.Todo;
import alisa.smallokr.entity.TodoRepeat;
import alisa.smallokr.mapper.TodoMapper;
import alisa.smallokr.mapper.TodoRepeatMapper;
import alisa.smallokr.service.TodoService;
import alisa.smallokr.vo.TodoVo;

@Service
public class TodoServiceImpl implements TodoService {
    @Autowired
    private TodoMapper todoMapper;
    @Autowired
    private TodoRepeatMapper todoRepeatMapper;

    @Override
    public boolean saveTodo(Todo todo) {
        return todoMapper.saveTodo(todo);
    }

    @Override
    public boolean deleteTodo(String todoId) {
        return todoMapper.deleteTodo(todoId);
    }

    @Override
    public boolean updateTodo(Todo todo) {
        throw new UnsupportedOperationException("Unimplemented method 'updateTodo'");
    }

    @Override
    public List<TodoVo> findTodoByUser(String userId) {
        return todoMapper.findTodoByUser(userId);
    }

    @Override
    public List<TodoRepeat> getRepeats(String todoId) {
        return todoRepeatMapper.getRepeats(todoId);
    }

    @Override
    public int addOrUpdateRepeat(List<TodoRepeat> todoRepeat) {
        return todoRepeatMapper.addOrUpdateRepeat(todoRepeat);
    }

    @Override
    public int deleteRepeat(List<String> todoRepeatIds) {
        return todoRepeatMapper.deleteRepeat(todoRepeatIds);
    }

    @Override
    public List<TodoVo> getTodoByUserAndWeekDay(String userId, LocalDateTime date, String weekDay) {
        return todoMapper.getTodoByUserAndWeekDay(userId, date, weekDay);
    }

}
