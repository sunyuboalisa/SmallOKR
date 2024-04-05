package alisa.smallokr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import alisa.smallokr.POJO.Test;
import io.seata.spring.annotation.GlobalTransactional;

@Service
public class TestService {
    @Autowired
    private TestClient testClient;

    @GlobalTransactional
    public void add(Test test) throws Exception {
        try {
            // 测试分支事物
            testClient.add(test);
            throw new RuntimeException("test");
        } catch (Exception e) {
            throw e;
        }
    }
}
