package alisa.smallokr.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import alisa.smallokr.POJO.Target;
import alisa.smallokr.service.TargetService;
import lombok.Data;

@RequestMapping("api/v1/target/")
@RestController
public class TargetController {
    @Autowired
    private TargetService targetService;

    @PostMapping("add")
    public ResponseEntity<Boolean> addTarget(@RequestBody Target target) {
        boolean res = targetService.addTarget(target);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("delete")
    public ResponseEntity<Boolean> deleteTarget(long targetId){
        boolean res=targetService.deleteTarget(targetId);
        return ResponseEntity.ok(res);
    }

    @PutMapping("update")
    public ResponseEntity<Boolean> updateTarget(Target target){
        boolean res=targetService.updateTarget(target);
        return ResponseEntity.ok(res);
    }

    @RequestMapping(value = "get", method = RequestMethod.GET)
    public ResponseEntity<Target> get(long targetId) {
        var target=targetService.findTargetById(targetId);
        return ResponseEntity.ok(target);
    }

    @GetMapping("getAll")
    public ResponseEntity<List<Target>> getAll() {
        List<Target> targets = targetService.findAll();
        return ResponseEntity.ok(targets);
    }

    @GetMapping("getAllTargetWithGroup")
    public List<TargetWithGroup> getAllTargetWithGroup() {
        List<Target> targets = targetService.findAll();

        List<TargetWithGroup> targetWithGroups = new ArrayList<TargetWithGroup>();
        for (Target t : targets) {
            TargetWithGroup targetWithGroup = new TargetWithGroup();
            targetWithGroup.getData().add(t);
            targetWithGroups.add(targetWithGroup);
        }
        return targetWithGroups;
    }
}

@Data
class TargetWithGroup {
    public TargetWithGroup() {
        this.title = "";
        this.data = new ArrayList<Target>();
    }

    private String title;
    private List<Target> data;
}
