package alisa.smallokr.entity;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Result {
    private String id;
    private String name;
    private String value;
    private String targetId;
    private LocalDateTime creTime;
}
