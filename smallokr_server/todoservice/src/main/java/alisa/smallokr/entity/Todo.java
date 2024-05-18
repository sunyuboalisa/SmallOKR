package alisa.smallokr.entity;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class Todo {
    private String id;
    private String userId;
    private String name;
    private String description;
    private LocalDateTime beginDate;
    private LocalDateTime endDate;
}
