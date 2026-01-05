package com.alisa.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.alisa.interceptors.UserInterceptor;
import com.alisa.model.UserContext;

import feign.RequestInterceptor;

@Configuration
public class UserAutoConfiguration implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 自动为所有引入此模块的服务注册拦截器
        registry.addInterceptor(new UserInterceptor()).addPathPatterns("/**");
    }

    @Bean
    public RequestInterceptor feignUserInterceptor() {
        return template -> {
            var user = UserContext.get();
            if (user != null) {
                template.header("X-User-Header", user.toBase64Json());
            }
        };
    }
}