package alisa.smallokr.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alisa.Util.JwtUtil;
import com.alisa.Util.Result;
import com.alisa.Util.UUIDTool;

import alisa.smallokr.entity.Target;
import alisa.smallokr.service.TargetService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

@RequestMapping("api/v1/target/")
@RestController
public class TargetController {
    @Autowired
    private TargetService targetService;

    @PostMapping("save")
    public Result<Boolean> addTarget(@RequestBody Target target, HttpServletRequest request) {
        var token = request.getHeader("Authorization").substring(7);
        var userId = JwtUtil.extractClaim(token, new Function<Claims, String>() {
            @Override
            public String apply(Claims claims) {
                return (String) claims.get("userId"); // 假设自定义声明为 userId
            }
        });

        if (target.getId() != null && !target.getId().equals("")) {
        } else {
            target.setId(UUIDTool.getUUID());
            target.setCreTime(LocalDateTime.now());
        }

        if (target.getStatus() == null) {
            target.setStatus("0");
        }
        target.setUserId(userId);
        boolean res = targetService.addTarget(target);

        return new Result<>(res);
    }

    @DeleteMapping("delete")
    public Result<Boolean> deleteTarget(String targetId) {
        boolean res = targetService.deleteTarget(targetId);
        return new Result<>(res);
    }

    @PutMapping("update")
    public Result<Boolean> updateTarget(Target target) {
        boolean res = targetService.updateTarget(target);
        return new Result<>(res);
    }

    @RequestMapping(value = "get", method = RequestMethod.GET)
    public Result<List<Target>> get(String userId, HttpServletRequest request) {
        var token = request.getHeader("Authorization").substring(7);
        if (userId == null) {
            userId = JwtUtil.extractClaim(token, new Function<Claims, String>() {
                @Override
                public String apply(Claims claims) {
                    return (String) claims.get("userId"); // 假设自定义声明为 userId
                }
            });
        }

        var target = targetService.findTargetByUserId(userId);
        return new Result<>(target);
    }

    @GetMapping("analysis")
    public void getAnalysis(){
        
    }
}
