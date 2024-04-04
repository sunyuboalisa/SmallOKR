package alisa.smallokr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import alisa.smallokr.POJO.Test;
import alisa.smallokr.service.TestService;

@RequestMapping("/api/v1/target/test")
@RestController
public class TestController {
    @Autowired
    private TestService testService;

    @PostMapping("add")
    public void add(@RequestBody Test test) throws Exception{
       testService.add(test);
    }
}
