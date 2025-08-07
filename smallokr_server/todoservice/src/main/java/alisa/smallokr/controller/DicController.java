package alisa.smallokr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alisa.util.Result;

import alisa.smallokr.entity.DicEntry;
import alisa.smallokr.service.DicService;

@RequestMapping("/api/v1/todo/dic")
@RestController
public class DicController {
    @Autowired
    private DicService dicService;

    @GetMapping("/get")
    public Result<List<DicEntry>> getDicEntry(String dicName) {
        List<DicEntry> entries = dicService.getDicEntrys(dicName);
        return new Result<List<DicEntry>>(entries);
    }
}
