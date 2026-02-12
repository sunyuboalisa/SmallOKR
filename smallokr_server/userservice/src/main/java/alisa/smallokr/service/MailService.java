package alisa.smallokr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendResetCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("【你的应用】密码重置验证码");
        message.setText(
                "您正在重置密码，验证码为：" + code + "\n\n" +
                        "有效期5分钟，请勿泄露给他人。\n" +
                        "如非本人操作，请忽略此邮件。");

        mailSender.send(message);
    }
}
