package alisa.smallokr.service;

import java.util.List;

import alisa.smallokr.POJO.Result;

public interface ResultService {
    boolean addResult(Result target);

    boolean deleteResult(long resultId);

    boolean updateResult(Result result);

    Result findResultById(long resultId);

    List<Result> findAll();
}
