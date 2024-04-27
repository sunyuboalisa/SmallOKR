package alisa.smallokr.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import alisa.smallokr.POJO.Result;
import alisa.smallokr.mapper.ResultMapper;
import alisa.smallokr.service.ResultService;

@Service(value = "ResultService")
public class ResultServiceImpl implements ResultService {
    @Autowired
    ResultMapper resultMapper;

    @Override
    public boolean addResult(Result target) {
        return resultMapper.addResult(target);
    }

    @Override
    public boolean deleteResult(long resultId) {
        return resultMapper.deleteResult(resultId);
    }

    @Override
    public boolean updateResult(Result result) {
        return resultMapper.updateResult(result);
    }

    @Override
    public Result findResultById(long resultId) {
        return resultMapper.findResultById(resultId);
    }

    @Override
    public List<Result> findAll() {
        return resultMapper.findAll();
    }

}
