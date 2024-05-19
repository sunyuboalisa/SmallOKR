package alisa.smallokr.service;

import java.util.List;

import alisa.smallokr.entity.Result;

public interface ResultService {
    boolean addResult(Result result);

    long saveOrUpdateResult(List<Result> results);

    boolean deleteResult(String resultId);

    boolean updateResult(Result result);

    Result findResultById(String resultId);

    List<Result> findAll(String targetId);
}
