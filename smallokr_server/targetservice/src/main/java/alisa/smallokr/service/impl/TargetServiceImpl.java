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
    public List<Target> findAll() {
        List<Target> targets = targetMapper.findAll();
        return targets;
    }

    @Override
    public boolean addTarget(Target target) {
        boolean res = targetMapper.addTarget(target);
        return res;
    }

    @Override
    public Target findTargetById(long targetId) {
        var target = targetMapper.findTargetById(targetId);
        return target;
    }

    @Override
    public boolean updateTarget(Target target) {
        var res = targetMapper.updateTarget(target);
        return res;
    }

    @Override
    public boolean deleteTarget(long targetId) {
        var res=targetMapper.deleteTarget(targetId);
        return res;
    }

}
