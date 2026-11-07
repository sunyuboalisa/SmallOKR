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
    JdbcTemplate jdbc;SqlSession session;TargetMapper targets;ResultMapper results;
    @BeforeEach void setup() throws Exception {
        var ds=new DriverManagerDataSource("jdbc:h2:mem:"+java.util.UUID.randomUUID()+";MODE=MySQL;NON_KEYWORDS=VALUE","sa","");jdbc=new JdbcTemplate(ds);
        // Keep one connection open for the lifetime of this in-memory database.
        ds.setUrl(ds.getUrl()+";DB_CLOSE_DELAY=-1");
        jdbc.execute("create table tb_target(target_id varchar primary key,user_id varchar,target_name varchar,target_description varchar,cre_time timestamp,target_status varchar,tenant_id varchar)");
        jdbc.execute("create table tb_result(result_id varchar primary key,result_name varchar,result_value varchar,target_id varchar,cre_time timestamp)");
        jdbc.update("insert into tb_target(target_id,user_id,target_name,tenant_id) values('a','same-user','A','tenant-a'),('b','same-user','B','tenant-b')");
        jdbc.update("insert into tb_result(result_id,result_name,target_id) values('ra','A','a'),('rb','B','b')");
        var bean=new SqlSessionFactoryBean();bean.setDataSource(ds);bean.setMapperLocations(new ClassPathResource("alisa/smallokr/mapper/xml/TargetMapper.xml"),new ClassPathResource("alisa/smallokr/mapper/xml/ResultMapper.xml"));
        session=bean.getObject().openSession(true);targets=session.getMapper(TargetMapper.class);results=session.getMapper(ResultMapper.class);
        var user=new UserContext();user.setUserId("same-user");user.setTenantId("tenant-a");UserContext.set(user);
    }
    @AfterEach void close() {UserContext.remove();session.close();}
    @Test void readsAndDeletesCannotCrossTenantEvenForTheSameUser() {
        assertEquals(1,targets.findTargetByUser("same-user").size());assertNull(targets.findTargetByID("b"));assertNull(results.findResultById("rb"));
        assertTrue(results.findResultByTargetID("b").isEmpty());assertFalse(targets.deleteTarget("b"));assertFalse(results.deleteResult("rb"));
        assertEquals("B",jdbc.queryForObject("select target_name from tb_target where target_id='b'",String.class));
    }
    @Test void applicationReadsAllPermittedTenantRowsButNoOtherTenant() {
        UserContext.get().setApplication(true);assertEquals(1,targets.findTargetByUser(null).size());
    }
    @Test void duplicateIdsCannotUpdateAnotherTenantsRow() {
        var target=new alisa.smallokr.entity.Target();target.setId("b");target.setName("attacked");target.setUserId("same-user");targets.saveTarget(target);
        assertEquals("B",jdbc.queryForObject("select target_name from tb_target where target_id='b'",String.class));
    }
}
