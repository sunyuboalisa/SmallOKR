package alisa.smallokr.service;

import java.util.List;

import alisa.smallokr.entity.Target;

public interface TargetService {
    boolean addTarget(Target target);

    boolean deleteTarget(String targetId);

    boolean updateTarget(Target target);

    List<Target> findTargetByUserId(String userId);

    List<Target> findAll();
}
