package alisa.smallokr.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import alisa.smallokr.POJO.Target;
import alisa.smallokr.service.TargetService;
import lombok.Data;

@RequestMapping("api/target/")
@RestController
public class TargetController {
    @Autowired
    private TargetService targetService;

    @GetMapping("getAll")
    public ResponseEntity<List<Target>> getAllTargets(){
        List<Target> targets= targetService.getAllTargets();
        return ResponseEntity.ok(targets);
    }

    @PostMapping("add")
    public ResponseEntity<Boolean> addTarget(@RequestBody Target target){
        boolean res=targetService.addTarget(target);
        return ResponseEntity.ok(res);
    }

    @PutMapping("assignGroup")
    public ResponseEntity<Boolean> assignGroup(long groupId){
        boolean res=targetService.assignGroup(groupId);
        return ResponseEntity.ok(res);
    }

    @GetMapping("getAllTargetWithGroup")
    public List<TargetWithGroup> getAllTargetWithGroup(){
        List<Target> targets= targetService.getAllTargets();

        List<TargetWithGroup> targetWithGroups =new ArrayList<TargetWithGroup>();
        for (Target t : targets) {
            TargetWithGroup targetWithGroup= new TargetWithGroup();
            targetWithGroup.getData().add(t);
            targetWithGroups.add(targetWithGroup);
        }
        return targetWithGroups;
    }
 }

 @Data
 class TargetWithGroup{
    public TargetWithGroup(){
        this.title="";
        this.data=new ArrayList<Target>();
    }
private String title;
private List<Target> data;
 }
