package alisa.smallokr.service;

import java.util.List;

import alisa.smallokr.entity.Result;

public interface ResultService {
    boolean addResult(Result target);

    boolean deleteResult(String resultId);

    boolean updateResult(Result result);

    Result findResultById(String resultId);

    List<Result> findAll(String targetId);
}
