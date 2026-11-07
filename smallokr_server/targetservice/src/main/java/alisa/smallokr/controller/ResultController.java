package alisa.smallokr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alisa.util.UUIDTool;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import alisa.smallokr.entity.Result;
import alisa.smallokr.service.ResultService;

@RequestMapping("/api/v1/result/")
@RestController
public class ResultController {
    @Autowired
    private ResultService resultService;
    @Autowired private alisa.smallokr.service.TargetAccess access;

    @PostMapping("save")
    public com.alisa.util.Result<Boolean> addResult(@RequestBody List<Result> results) {
        results.forEach(access::saveResult);
        boolean res = true;

        if (results.size() > 0) {
            results.forEach(x -> {
                if (x.getId() != null && !x.getId().equals("")) {
                } else {
                    x.setId(UUIDTool.getUUID());
                }
            });
            long count = resultService.saveOrUpdateResult(results);
            if (results.size() != count) {
                res = false;
            }
        }

        return new com.alisa.util.Result<Boolean>(res);
    }

    @DeleteMapping("delete")
    public com.alisa.util.Result<Boolean> deleteResult(@RequestParam String resultId) {
        access.result(resultId,"delete");
        boolean res = resultService.deleteResult(resultId);
        return new com.alisa.util.Result<Boolean>(res);
    }

    @GetMapping("get")
    public com.alisa.util.Result<Result> get(String resultId) {
        access.result(resultId,"read");
        var result = resultService.findResultById(resultId);
        return new com.alisa.util.Result<Result>(result);
    }

    @GetMapping("getAll")
    public com.alisa.util.Result<List<Result>> getAll(@RequestParam String targetId) {
        access.owner(targetId);
        access.require("result",targetId,"read");
        List<Result> targets = resultService.findAll(targetId);
        return new com.alisa.util.Result<>(targets);
    }
}
