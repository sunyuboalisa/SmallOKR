package alisa.smallokr.dto;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String username;
    private String email;

    private String currentPassword;

    private String newPassword;
    private String code;
}