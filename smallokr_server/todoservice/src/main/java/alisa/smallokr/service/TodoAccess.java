package alisa.smallokr.service;

import alisa.smallokr.mapper.*;
import com.alisa.model.UserContext;
import com.alisa.security.ResourceAccess;
import org.springframework.stereotype.Component;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Component
public class TodoAccess {
    private final TodoMapper todos;
    private final TodoRepeatMapper repeats;
    private final ResourceAccess access;
    public TodoAccess(TodoMapper todos,TodoRepeatMapper repeats,ResourceAccess access) { this.todos=todos;this.repeats=repeats;this.access=access; }
    public String user() { return UserContext.get().getUserId(); }
    public void require(String id,String action) { access.require("todo",id,action); }
    public void todo(String id,String action) {
        var todo=todos.findTodoById(id);
        if(todo==null || !UserContext.get().isApplication() && !user().equals(todo.getUserId())) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        require(id,action);
    }
    public void repeat(String id) {
        var repeat=repeats.findById(id);
        if(repeat==null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        todo(repeat.getTodoId(),"update");
    }
    public void saveRepeat(alisa.smallokr.entity.TodoRepeat repeat) {
        todo(repeat.getTodoId(),"update");
        if(repeat.getTodoRepeatId()!=null && !repeat.getTodoRepeatId().isBlank()) {
            repeat(repeat.getTodoRepeatId());
            if(!repeats.findById(repeat.getTodoRepeatId()).getTodoId().equals(repeat.getTodoId())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }
}
