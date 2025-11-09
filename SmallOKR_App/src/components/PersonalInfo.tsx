import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from '../state/UserContext';
import { MyStackScreenProps } from '../common/NativeScreenTypes';

const PersonalInfo = ({ navigation }: MyStackScreenProps<'PersonalInfo'>) => {
  const userContext = useContext(UserContext);
  // 假设这是从后端或全局状态获取的用户数据
  const userInfo = {
    name: userContext?.userInfo?.username,
    email: '',
  };

  const handleChangePassword = () => {
    // 导航到更改密码页面
    navigation.navigate('ChangePassword');
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>姓名</Text>
          <Text style={styles.infoValue}>{userInfo.name}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>邮箱</Text>
          <Text style={styles.infoValue}>{userInfo.email}</Text>
        </View>
      </View>

      {/* 更改密码选项 */}
      <TouchableOpacity
        style={styles.optionItem}
        onPress={handleChangePassword}
      >
        <Text style={styles.optionText}>更改密码</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  infoItem: {
    padding: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 16,
  },
  optionItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#9175be',
    fontWeight: '500',
  },
});

export default PersonalInfo;
