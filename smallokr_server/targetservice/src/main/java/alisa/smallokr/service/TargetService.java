package alisa.smallokr.service;

import java.util.List;

import alisa.smallokr.POJO.Target;

public interface TargetService {
    boolean addTarget(Target target);

    boolean deleteTarget(long targetId);

    boolean updateTarget(Target target);

    Target findTargetById(long targetId);

    List<Target> findAll();
}
