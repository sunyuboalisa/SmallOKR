import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import {UserContext, UserDispatchContext} from '../state/UserContext';
import Avatar from './Avatar';

interface MenuItemProps {
  title: string;
  handlePress?: (e: any) => void;
}
const MenuItem = ({title, handlePress}: MenuItemProps) => {
  return (
    <Pressable
      style={styles.menuItemContainer}
      onPress={e => {
        if (handlePress != null) {
          handlePress(e);
        }
      }}>
      <Text>{title}</Text>
    </Pressable>
  );
};

const Me = () => {
  const dispatch = useContext(UserDispatchContext);
  const userContext = useContext(UserContext);
  const handleLogout = () => {
    dispatch({type: 'Logout'});
  };
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Avatar username={userContext?.userInfo?.username} />
      </View>
      <View style={styles.menuContainer}>
        {/* <MenuItem title="设置" /> */}
        <MenuItem title="个人信息" />
        <MenuItem title="退出登录" handlePress={handleLogout} />
      </View>
    </View>
  );
};

export default Me;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    padding: 20,
  },
  menuItemContainer: {
    borderWidth: 1,
    width: '100%',
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: 5,
    marginBottom: -1,
  },
  menuContainer: {
    alignItems: 'flex-start',
    padding: 10,
  },
  circle: {
    alignContent: 'center',
    borderWidth: 1,
    width: 80,
    height: 80,
    borderRadius: 1000,
  },
});
