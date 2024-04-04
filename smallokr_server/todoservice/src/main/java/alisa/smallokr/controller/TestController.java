package alisa.smallokr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import alisa.smallokr.POJO.Test;
import alisa.smallokr.mapper.TestMapper;

@RequestMapping("/api/v1/todo/test")
@RestController
public class TestController {
    @Autowired
    private TestMapper testMapper;

    @PostMapping("add")
    @Transactional
    public void add(@RequestBody Test test){
        testMapper.add(test);
    }
}
