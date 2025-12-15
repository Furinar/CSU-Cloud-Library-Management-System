package com.skyfirst.library_borrowing.dto;

import lombok.Data;

@Data
public class UserResetPasswordDTO {
    private String email;
    private String newPassword;
}
