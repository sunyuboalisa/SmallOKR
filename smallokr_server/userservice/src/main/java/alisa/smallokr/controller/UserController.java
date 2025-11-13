package alisa.smallokr.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alisa.util.JwtUtil;
import com.alisa.util.Result;
import com.alisa.util.UUIDTool;

import alisa.smallokr.dto.ChangePasswordRequest;
import alisa.smallokr.dto.user.UserDto;
import alisa.smallokr.entity.User;
import alisa.smallokr.service.MailService;
import alisa.smallokr.service.UserService;

@RestController
@RequestMapping("api/v1/user")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private MailService mailService;
    @Autowired
    private StringRedisTemplate redisTemplate;

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendResetCode(
            @RequestBody Map<String, String> requestBody // 推荐方式：接收JSON
    ) {
        String email = requestBody.get("email");

        // 验证邮箱格式
        if (email == null || !email.matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "邮箱格式无效"));
        }
        String code = String.format("%06d", new Random().nextInt(999999)); // 6位随机码

        try {
            saveCode(email, code);
            mailService.sendResetCode(email, code);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "验证码已发送"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "邮件发送失败: " + e.getMessage()));
        }
    }

    @PostMapping("signin")
    public Result<String> signin(@RequestBody UserDto userDto) {
        var user = userService.loadUserByName(userDto.getUsername());
        String token = "";
        if (userDto.getPassword().equals(user.getPassword())) {
            Map<String, Object> claims = new HashMap();
            claims.put("userId", user.getId());
            token = JwtUtil.GenerateToken(user.getUsername(), claims);
        }

        return new Result<>(token);
    }

    @PostMapping("signup")
    public Result<Boolean> signup(@RequestBody UserDto userDto) {
        User user = new User();
        user.setId(UUIDTool.getUUID());
        user.setUsername(userDto.getUsername());
        user.setPassword(userDto.getPassword());
        user.setEmail(userDto.getEmail());
        var res = userService.saveUser(user);
        return new Result<>(res);
    }

    @PostMapping("change-password")
    public Result<Boolean> changePassowrd(@RequestBody ChangePasswordRequest param) {
        boolean res = false;

        User user = userService.loadUserByName(param.getUsername());
        if (user != null && user.getPassword().equals(param.getCurrentPassword())) {
            user.setPassword(param.getNewPassword());
            res = userService.saveUser(user);
        }

        return new Result<>(res);
    }

    @PostMapping("change-password-email")
    public Result<Boolean> changePassowrdByEmail(@RequestBody ChangePasswordRequest param) {
        boolean res = false;
        if (validateCode(param.getEmail(), param.getCode())) {
            User user = userService.loadUserByName(param.getEmail());
            if (user != null && user.getPassword().equals(param.getNewPassword())) {
                user.setPassword(param.getNewPassword());
                res = userService.saveUser(user);
            }
        }

        return new Result<>(res);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("UP");
    }

    public void saveCode(String email, String code) {
        String key = "reset:code:" + email;
        redisTemplate.opsForValue().set(key, code, 5, TimeUnit.MINUTES); // 5分钟过期
    }

    public boolean validateCode(String email, String code) {
        String storedCode = redisTemplate.opsForValue().get("reset:code:" + email);
        return code.equals(storedCode);
    }
}
