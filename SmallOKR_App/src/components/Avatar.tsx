import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ThemeContext} from '../state/ThemeContext';

interface AvatarProps {
  username: string | undefined;
}

const Avatar: React.FC<AvatarProps> = ({username}) => {
  const initials = username == null ? 'D' : username.slice(0, 1).toUpperCase(); // 获取首字母
  const theme = useContext(ThemeContext)?.theme;
  // const backgroundColor = generateColor(username);
  const backgroundColor = theme?.colors.background;
  return (
    <View
      style={{
        ...styles.avatar,
        backgroundColor: backgroundColor,
        borderColor: theme?.colors.text,
      }}>
      <Text
        style={{
          ...styles.text,
          color: theme?.colors.text,
        }}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default Avatar;
