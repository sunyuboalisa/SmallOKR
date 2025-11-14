import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { UserContext, UserDispatchContext } from '../state/UserContext';
import Avatar from './Avatar';
import { ThemeContext } from '../state/ThemeContext';
import IconMenuItem from './IconMenuItem';
import { MyStackScreenProps } from '../common/NativeScreenTypes';

const Me = ({ navigation }: MyStackScreenProps<'Me'>) => {
  const dispatch = useContext(UserDispatchContext);
  const userContext = useContext(UserContext);
  const themeContext = useContext(ThemeContext);

  const handleLogout = () =>
    dispatch({
      type: 'Logout',
      user: {
        ...userContext.userInfo,
        token: '',
        status: 'online',
      },
    });
  const handleToggleTheme = () => themeContext?.toggleTheme();

  return (
    <View
      style={[
        styles.page,
        { backgroundColor: themeContext?.theme.colors.background },
      ]}
    >
      <View style={styles.container}>
        <Avatar username={userContext?.userInfo?.username} />
      </View>

      <View
        style={[
          styles.menuContainer,
          {
            backgroundColor: themeContext?.theme.colors.card,
            // shadowColor: themeContext?.theme.colors.shadow,
          },
        ]}
      >
        <IconMenuItem
          title="个人信息"
          icon="person-outline"
          onPress={() => navigation.navigate('PersonalInfo')}
        />
        <IconMenuItem
          title="行为分析报告"
          icon="analytics-outline"
          onPress={() => navigation.navigate('BehaviorAnalysis')}
        />
        <IconMenuItem
          title="主题切换"
          icon="theme" // 特殊关键字会自动处理
          onPress={handleToggleTheme}
        />
        <IconMenuItem
          title="退出登录"
          icon="log-out-outline"
          onPress={handleLogout}
          isLastItem
          iconColor="#FF3B30" // 红色强调色
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 40,
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  menuContainer: {
    alignSelf: 'center',
    width: '90%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});

export default Me;
