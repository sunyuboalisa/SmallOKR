package alisa.smallokr.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;

@FeignClient("target-service")
public interface MyFeginClient {
    @RequestMapping("/api/v1/target/get")
    String get();
}
