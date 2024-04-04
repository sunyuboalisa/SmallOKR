package alisa.smallokr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import alisa.smallokr.client.MyFeginClient;

@RequestMapping("api/v1/trace")
@RestController
public class TraceController {
    @Autowired
    private MyFeginClient feginClient;

    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public String echo() {
        return feginClient.get();
    }
}
