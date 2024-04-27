package alisa.smallokr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import alisa.smallokr.util.JwtUtil;

@RestController
@RequestMapping("api/v1/user")
public class UserController {
    @Autowired 
    private JwtUtil jwtUtil;
    @PostMapping("login")
    public String login(){
        return jwtUtil.GenerateToken("test");
    }
}
