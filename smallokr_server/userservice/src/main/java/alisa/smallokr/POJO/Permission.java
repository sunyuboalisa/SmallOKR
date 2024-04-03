package alisa.smallokr.POJO;

import lombok.Data;

@Data
public class Permission {
    private long id;
    private String name;
    private String description;
    private long roleId;
}
