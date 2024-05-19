package alisa.smallokr.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import alisa.smallokr.entity.Result;

@Mapper
public interface ResultMapper {
        boolean saveResult(Result result);

        long saveOrUpdateResult(List<Result> result);

        boolean deleteResult(String resultId);

        boolean updateResult(Result result);

        List<Result> findResultByTargetID(String targetId);
}
