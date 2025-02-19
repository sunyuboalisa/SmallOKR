package com.alisa.Util;

import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

public class JwtUtil {
    public static final String SECRET = "357638792F423F4428472B4B6250655368566D597133743677397A2443264629";

    public static String extractUsername(String token) {
        String username = "";
        try {
            username = extractClaim(token, Claims::getSubject);
        } catch (Exception e) {
        }
        return username;
    }

    public static Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public static <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private static Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public static Boolean isTokenExpired(String token) {
        boolean res = false;
        try {
            var c = JwtUtil.extractAllClaims(token);
            res = extractExpiration(token)
                    .before(new Date());
        } catch (Exception e) {
            res = true;
        }
        return res;
    }

    public static Boolean validateToken(String token, String username) {
        final String tempusername = extractUsername(token);
        return (tempusername.equals(username) && !isTokenExpired(token));
    }

    public static String GenerateToken(String username, Map<String, Object> claims) {
        return createToken(claims, username);
    }

    private static String createToken(Map<String, Object> claims, String username) {
        LocalDateTime expirationTime = LocalDateTime.now().plusDays(30);
        Date expirationDate = Date.from(expirationTime.atZone(ZoneId.systemDefault()).toInstant());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setExpiration(expirationDate)
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
    }

    private static Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
