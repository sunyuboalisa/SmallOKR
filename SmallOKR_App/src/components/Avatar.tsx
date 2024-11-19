import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface AvatarProps {
  username: string;
}

// 生成随机颜色
const generateColor = (name: string): string => {
  const hash =
    name == null
      ? 10
      : name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `hsl(${hash % 360}, 60%, 70%)`; // 生成 HSL 颜色
};

const Avatar: React.FC<AvatarProps> = ({username}) => {
  const initials = username == null ? 'D' : username.slice(0, 1).toUpperCase(); // 获取首字母
  const backgroundColor = generateColor(username);

  return (
    <View style={[styles.avatar, {backgroundColor}]}>
      <Text style={styles.text}>{initials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Avatar;
