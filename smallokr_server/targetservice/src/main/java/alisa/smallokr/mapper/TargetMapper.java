package alisa.smallokr.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import alisa.smallokr.entity.Target;

@Mapper
public interface TargetMapper {

        boolean saveTarget(Target target);

        boolean deleteTarget(String targetId);

        boolean updateTarget(Target target);

        List<Target> findTargetByUser(String userId);

        List<Target> findAll();
}
