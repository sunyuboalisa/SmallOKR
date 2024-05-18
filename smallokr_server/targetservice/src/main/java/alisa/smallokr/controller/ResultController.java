package alisa.smallokr.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alisa.Util.UUIDTool;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;

import alisa.smallokr.entity.Result;
import alisa.smallokr.service.ResultService;

@RequestMapping("/api/v1/result/")
@RestController
public class ResultController {
    @Autowired
    private ResultService resultService;

    @PostMapping("add")
    public com.alisa.Util.Result<Boolean> addResult(@RequestBody Result result) {
        result.setId(UUIDTool.getUUID());
        result.setCreTime(LocalDateTime.now());
        boolean res = resultService.addResult(result);
        return new com.alisa.Util.Result<Boolean>(res);
    }

    @DeleteMapping("delete")
    public com.alisa.Util.Result<Boolean> deleteResult(@RequestParam String resultId) {
        boolean res = resultService.deleteResult(resultId);
        return new com.alisa.Util.Result<Boolean>(res);
    }

    @PutMapping("update")
    public com.alisa.Util.Result<Boolean> updateResult(Result result) {
        boolean res = resultService.updateResult(result);
        return new com.alisa.Util.Result<Boolean>(res);
    }

    @GetMapping("get")
    public com.alisa.Util.Result<Result> get(String resultId) {
        var target = resultService.findResultById(resultId);
        return new com.alisa.Util.Result<Result>(target);
    }

    @GetMapping("getAll")
    public com.alisa.Util.Result<List<Result>> getAll(@RequestParam String targetId) {
        List<Result> targets = resultService.findAll(targetId);
        return new com.alisa.Util.Result<>(targets);
    }
}
