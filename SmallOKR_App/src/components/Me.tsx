import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';

interface MenuItemProps {
  title: string;
}
const MenuItem = ({title}: MenuItemProps) => {
  return (
    <Pressable style={styles.menuItemContainer}>
      <Text>{title}</Text>
    </Pressable>
  );
};
const Me = () => {
  return (
    <View>
      <View style={styles.container}>
        <Image style={styles.circle} />
      </View>
      <View style={styles.menuContainer}>
        <MenuItem title="统计信息" />
        <MenuItem title="设置" />
      </View>
    </View>
  );
};

export default Me;

const styles = StyleSheet.create({
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
    marginBottom:-1,
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
