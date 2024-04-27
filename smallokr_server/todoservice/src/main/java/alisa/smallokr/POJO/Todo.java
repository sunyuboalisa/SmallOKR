package alisa.smallokr.POJO;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class Todo {
    private long id;
    private long userId;
    private String name;
    private String description;
    private LocalDateTime beginDate;
    private LocalDateTime endDate;
}
