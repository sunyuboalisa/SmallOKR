package alisa.smallokr.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import alisa.smallokr.POJO.Target;
import alisa.smallokr.mapper.TargetMapper;
import alisa.smallokr.service.TargetService;

@Service(value = "TargetService")
public class TargetServiceImpl implements TargetService {
    @Autowired
    private TargetMapper targetMapper;
    @Override
    public List<Target> getAllTargets() {
        List<Target> targets=targetMapper.getAllTargets();
        return targets;
    }

    @Override
    public boolean addTarget(Target target) {
        boolean res= targetMapper.addTarget(target);
        return res;
    }

    @Override
    public boolean assignGroup(long groupId) {
        throw new UnsupportedOperationException("Unimplemented method 'assignGroup'");
    }
    
}
