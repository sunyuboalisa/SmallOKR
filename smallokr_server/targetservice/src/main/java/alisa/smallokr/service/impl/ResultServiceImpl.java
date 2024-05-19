package alisa.smallokr.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import alisa.smallokr.entity.Result;
import alisa.smallokr.mapper.ResultMapper;
import alisa.smallokr.service.ResultService;

@Service
public class ResultServiceImpl implements ResultService {
    @Autowired
    ResultMapper resultMapper;

    @Override
    public boolean addResult(Result target) {
        return resultMapper.saveResult(target);
    }

    @Override
    public long saveOrUpdateResult(List<Result> results) {
        return resultMapper.saveOrUpdateResult(results);
    }

    @Override
    public boolean deleteResult(String resultId) {
        return resultMapper.deleteResult(resultId);
    }

    @Override
    public boolean updateResult(Result result) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateResult'");
    }

    @Override
    public Result findResultById(String resultId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findResultById'");
    }

    @Override
    public List<Result> findAll(String targetId) {
        return resultMapper.findResultByTargetID(targetId);
    }

}
