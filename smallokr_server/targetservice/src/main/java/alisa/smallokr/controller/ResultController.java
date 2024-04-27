package alisa.smallokr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import alisa.smallokr.POJO.Result;
import alisa.smallokr.service.ResultService;

@RequestMapping("/api/v1/result/")
@RestController
public class ResultController {
    @Autowired
    private ResultService resultService;

    @PostMapping("add")
    public ResponseEntity<Boolean> addResult(@RequestBody Result result) {
        boolean res = resultService.addResult(result);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("delete")
    public ResponseEntity<Boolean> deleteResult(long resultId) {
        boolean res = resultService.deleteResult(resultId);
        return ResponseEntity.ok(res);
    }

    @PutMapping("update")
    public ResponseEntity<Boolean> updateResult(Result result) {
        boolean res = resultService.updateResult(result);
        return ResponseEntity.ok(res);
    }

    @GetMapping("get")
    public ResponseEntity<Result> get(long resultId) {
        var target = resultService.findResultById(resultId);
        return ResponseEntity.ok(target);
    }

    @GetMapping("getAll")
    public ResponseEntity<List<Result>> getAll() {
        List<Result> targets = resultService.findAll();
        return ResponseEntity.ok(targets);
    }
}
