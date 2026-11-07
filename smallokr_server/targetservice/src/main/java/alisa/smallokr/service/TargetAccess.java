package alisa.smallokr.service;

import alisa.smallokr.mapper.*;
import com.alisa.model.UserContext;
import com.alisa.security.ResourceAccess;
import org.springframework.stereotype.Component;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Component
public class TargetAccess {
    private final TargetMapper targets;
    private final ResultMapper results;
    private final ResourceAccess access;
    public TargetAccess(TargetMapper targets,ResultMapper results,ResourceAccess access) { this.targets=targets;this.results=results;this.access=access; }
    public String user() { return UserContext.get().getUserId(); }
    public void require(String type,String id,String action) { access.require(type,id,action); }
    public void target(String id,String action) {
        var target=targets.findTargetByID(id);
        if(target==null || !UserContext.get().isApplication() && !user().equals(target.getUserId())) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"目标不存在");
        require("target",id,action);
    }
    public void result(String id,String action) {
        var result=results.findResultById(id);
        if(result==null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        owner(result.getTargetId()); require("result",id,action);
    }
    public void owner(String targetId) {
        var target=targets.findTargetByID(targetId);
        if(target==null || !UserContext.get().isApplication() && !user().equals(target.getUserId())) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
    public void saveTarget(alisa.smallokr.entity.Target target) {
        if(target.getId()!=null && !target.getId().isBlank()) target(target.getId(),"update");
        else require("target","*","create");
    }
    public void saveResult(alisa.smallokr.entity.Result result) {
        owner(result.getTargetId());
        if(result.getId()!=null && !result.getId().isBlank()) {
            result(result.getId(),"update");
            if(!results.findResultById(result.getId()).getTargetId().equals(result.getTargetId())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"不允许变更成果所属目标");
        } else require("result",result.getTargetId(),"create");
    }
}
