package alisa.smallokr.service;

import java.util.List;

import alisa.smallokr.POJO.Target;

public interface TargetService {
    List<Target> getAllTargets();
    boolean addTarget(Target target);
    boolean assignGroup(long groupId);
}
