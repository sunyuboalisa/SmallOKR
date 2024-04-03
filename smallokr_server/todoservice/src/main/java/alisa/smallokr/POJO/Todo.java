package alisa.smallokr.POJO;

import java.util.Date;
import lombok.Data;

@Data
public class Todo {
    private long id;
    private String title;
    private Date beginDate;
    private Date endDate;
}
