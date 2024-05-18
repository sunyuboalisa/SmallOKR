package alisa.smallokr.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alisa.Util.JwtUtil;
import com.alisa.Util.Result;
import com.alisa.Util.UUIDTool;

import alisa.smallokr.dto.user.UserDto;
import alisa.smallokr.entity.User;
import alisa.smallokr.service.UserService;

@RestController
@RequestMapping("api/v1/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("signin")
    public Result<String> signin(@RequestBody UserDto userDto) {
        var user = userService.loadUserByName(userDto.getUsername());
        Map<String, Object> claims = new HashMap();
        claims.put("userId", user.getId());
        var token = JwtUtil.GenerateToken(user.getUsername(), claims);
        return new Result<>(token);
    }

    @PostMapping("signup")
    public Result<Boolean> signup(@RequestBody UserDto userDto) {
        User user = new User();
        user.setId(UUIDTool.getUUID());
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        var res = userService.saveUser(user);
        return new Result<>(res);
    }
}
