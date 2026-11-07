package alisa.smallokr.service;
import alisa.smallokr.mapper.*;
import alisa.smallokr.entity.*;
import com.alisa.model.UserContext;
import com.alisa.security.ResourceAccess;
import org.junit.jupiter.api.*;
import org.springframework.web.server.ResponseStatusException;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
class TodoAccessTest {
    TodoMapper todos=mock(TodoMapper.class);TodoRepeatMapper repeats=mock(TodoRepeatMapper.class);ResourceAccess resource=mock(ResourceAccess.class);
    TodoAccess access=new TodoAccess(todos,repeats,resource);
    @BeforeEach void user() {var u=new UserContext();u.setUserId("alice");UserContext.set(u);}
    @AfterEach void clear() {UserContext.remove();}
    @Test void repeatOperationsVerifyParentOwnership() {
        var t=new Todo();t.setUserId("bob");when(todos.findTodoById("other")).thenReturn(t);
        var repeat=new TodoRepeat();repeat.setTodoId("other");when(repeats.findById("repeat")).thenReturn(repeat);
        assertThrows(ResponseStatusException.class,()->access.repeat("repeat"));verifyNoInteractions(resource);
    }
    @Test void newRepeatRequiresUpdateScopeOnOwnedTodo() {
        var t=new Todo();t.setUserId("alice");when(todos.findTodoById("mine")).thenReturn(t);
        var repeat=new TodoRepeat();repeat.setTodoId("mine");access.saveRepeat(repeat);verify(resource).require("todo","mine","update");
    }
}
