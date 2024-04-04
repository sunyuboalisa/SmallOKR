package alisa.smallokr.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import alisa.smallokr.POJO.Test;

@FeignClient("todo-service")
public interface TestClient {
    @PostMapping("/api/v1/todo/test/add")
    void add(@RequestBody Test test);
}
