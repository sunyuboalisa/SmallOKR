package alisa.smallokr.service;
import alisa.smallokr.mapper.*;
import com.alisa.model.UserContext;
import org.junit.jupiter.api.*;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.core.io.ClassPathResource;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.apache.ibatis.session.*;
import static org.junit.jupiter.api.Assertions.*;
class TenantMapperTest {
    JdbcTemplate jdbc;SqlSession session;TodoMapper todos;TodoRepeatMapper repeats;
    @BeforeEach void setup() throws Exception {
        var ds=new DriverManagerDataSource("jdbc:h2:mem:"+java.util.UUID.randomUUID()+";MODE=MySQL;DB_CLOSE_DELAY=-1","sa","");jdbc=new JdbcTemplate(ds);
        jdbc.execute("create table tb_todo(todo_id varchar primary key,user_id varchar,todo_name varchar,todo_description varchar,todo_begin_date timestamp,todo_end_date timestamp,todo_status_id varchar,tenant_id varchar)");
        jdbc.execute("create table tb_todo_repeat(todo_repeat_id varchar primary key,todo_id varchar,repeat_id varchar)");
        jdbc.update("insert into tb_todo(todo_id,user_id,todo_name,tenant_id) values('a','same-user','A','tenant-a'),('b','same-user','B','tenant-b')");
        jdbc.update("insert into tb_todo_repeat(todo_repeat_id,todo_id,repeat_id) values('ra','a','daily'),('rb','b','daily')");
        var bean=new SqlSessionFactoryBean();bean.setDataSource(ds);bean.setMapperLocations(new ClassPathResource("alisa/smallokr/mapper/xml/TodoMapper.xml"),new ClassPathResource("alisa/smallokr/mapper/xml/TodoRepeatMapper.xml"));
        session=bean.getObject().openSession(true);todos=session.getMapper(TodoMapper.class);repeats=session.getMapper(TodoRepeatMapper.class);
        var user=new UserContext();user.setUserId("same-user");user.setTenantId("tenant-a");UserContext.set(user);
    }
    @AfterEach void close() {UserContext.remove();session.close();}
    @Test void todoAndRepeatReadsAndDeletesAreTenantScoped() {
        assertEquals(1,todos.findTodoByUser("same-user").size());assertNull(todos.findTodoById("b"));assertNull(repeats.findById("rb"));
        assertTrue(repeats.getRepeats("b").isEmpty());assertFalse(todos.deleteTodo("b"));assertEquals(0,repeats.deleteRepeat(java.util.List.of("rb")));
        assertEquals(1,jdbc.queryForObject("select count(*) from tb_todo_repeat where todo_repeat_id='rb'",Integer.class));
    }
    @Test void duplicateIdsCannotUpdateAnotherTenantsTodo() {
        var todo=new alisa.smallokr.entity.Todo();todo.setId("b");todo.setName("attacked");todo.setUserId("same-user");todos.saveTodo(todo);
        assertEquals("B",jdbc.queryForObject("select todo_name from tb_todo where todo_id='b'",String.class));
    }
}
