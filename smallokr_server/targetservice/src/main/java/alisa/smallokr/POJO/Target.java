package alisa.smallokr.POJO;

import java.util.List;

import lombok.Data;

@Data
public class Target {
    private long id;
    private long targetGroupId;
    private long userId;

    private String name;
    private String description;
    private List<Result> Results;
}
