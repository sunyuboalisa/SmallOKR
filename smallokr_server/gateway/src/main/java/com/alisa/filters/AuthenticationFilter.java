package com.alisa.filters;

import java.util.List;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.server.ServerWebExchange;

import com.alisa.Util.JwtUtil;

import reactor.core.publisher.Mono;

@CrossOrigin
@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        var request = exchange.getRequest();

        // 哪些路径不需要经过验证
        if (isExclude(request.getPath().toString())) {
            return chain.filter(exchange);
        }

        // 验证
        String token = null;
        String username = null;
        List<String> authHeaders = request.getHeaders().get("Authorization");
        if (authHeaders != null && !authHeaders.isEmpty()) {
            token = authHeaders.get(0).substring(7);
            username = JwtUtil.extractUsername(token);
        }
        // 此处应先查询用户是否存在，以后再改
        if (username != null && JwtUtil.validateToken(token, username)) {
            // 验证成功
            System.out.println();
        } else {
            // 验证失败
            var response = exchange.getResponse();
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return response.setComplete();
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return 0;
    }

    private boolean isExclude(String requestPath) {
        final String[] excludePaths = { "/api/v1/user/send", "/api/v1/user/signin", "/api/v1/user/signup",
                "/api/v1/user/change-password" };
        AntPathMatcher antPathMatcher = new AntPathMatcher();

        for (String string : excludePaths) {
            if (antPathMatcher.match(string, requestPath)) {
                return true;
            }
        }

        return false;
    }
}
