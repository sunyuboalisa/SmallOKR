package alisa.smallokr.vo;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class TodoVo {
    private String id;
    private String userId;
    private String name;
    private String description;
    @JsonFormat(pattern = "HH:mm")
    private LocalDateTime beginDate;
    @JsonFormat(pattern = "HH:mm")
    private LocalDateTime endDate;
    private String status;
}
