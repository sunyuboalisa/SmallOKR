package alisa.smallokr.POJO;

import lombok.Data;

@Data
public class Target {
    private long id;
    private long targetGroupId;
    private String name;
    private String description;
}
