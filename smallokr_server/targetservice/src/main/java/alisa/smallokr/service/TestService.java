package alisa.smallokr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import alisa.smallokr.POJO.Test;
import alisa.smallokr.mapper.TestMapper;
import io.seata.common.exception.NotSupportYetException;
import io.seata.spring.annotation.GlobalTransactional;

@Service
public class TestService {
    @Autowired
    private TestMapper testMapper;
    @Autowired
    private TestClient testClient;

    @GlobalTransactional
    public void add(Test test) throws Exception {
        try {
            testMapper.add(test);
            testClient.add(test);
            throw new NotSupportYetException("test");
        } catch (Exception e) {
            throw e;
        }
    }
}
