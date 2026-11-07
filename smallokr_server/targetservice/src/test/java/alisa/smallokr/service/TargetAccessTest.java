package alisa.smallokr.service;
import alisa.smallokr.mapper.*;
import alisa.smallokr.entity.*;
import com.alisa.model.UserContext;
import com.alisa.security.ResourceAccess;
import org.junit.jupiter.api.*;
import org.springframework.web.server.ResponseStatusException;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
class TargetAccessTest {
    TargetMapper targets=mock(TargetMapper.class);ResultMapper results=mock(ResultMapper.class);ResourceAccess resource=mock(ResourceAccess.class);
    TargetAccess access=new TargetAccess(targets,results,resource);
    @BeforeEach void user() {var u=new UserContext();u.setUserId("alice");UserContext.set(u);}
    @AfterEach void clear() {UserContext.remove();}
    @Test void anotherUsersTargetCannotBeReadOrChanged() {
        var t=new Target();t.setId("other");t.setUserId("bob");when(targets.findTargetByID("other")).thenReturn(t);
        for(String action:java.util.List.of("read","update","delete")) assertThrows(ResponseStatusException.class,()->access.target("other",action));
        verifyNoInteractions(resource);
    }
    @Test void existingResultsCannotBeMovedToAnotherTarget() {
        var t=new Target();t.setUserId("alice");when(targets.findTargetByID(anyString())).thenReturn(t);
        var existing=new Result();existing.setId("r");existing.setTargetId("original");when(results.findResultById("r")).thenReturn(existing);
        var update=new Result();update.setId("r");update.setTargetId("different");
        assertThrows(ResponseStatusException.class,()->access.saveResult(update));
    }
}
