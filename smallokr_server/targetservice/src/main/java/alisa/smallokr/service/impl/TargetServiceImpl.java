package alisa.smallokr.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import alisa.smallokr.entity.Target;
import alisa.smallokr.mapper.TargetMapper;
import alisa.smallokr.service.TargetService;

@Service
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
        boolean res = targetMapper.saveTarget(target);
        return res;
    }

    @Override
    public List<Target> findTargetByUserId(String userId) {
        var target = targetMapper.findTargetByUser(userId);
        return target;
    }

    @Override
    public boolean updateTarget(Target target) {
        var res = targetMapper.updateTarget(target);
        return res;
    }

    @Override
    public boolean deleteTarget(String targetId) {
        var res=targetMapper.deleteTarget(targetId);
        return res;
    }

}
