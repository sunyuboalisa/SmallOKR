import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { UserContext, UserDispatchContext } from '../state/UserContext';
import useUserService from '../service/UserService';

const ChangePasswordScreen = () => {
  const userService = useUserService();
  const user = useContext(UserContext);
  const dispatch = useContext(UserDispatchContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!currentPassword) {
      newErrors.currentPassword = '请输入当前密码';
      valid = false;
    }

    if (!newPassword) {
      newErrors.newPassword = '请输入新密码';
      valid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = '密码至少需要8个字符';
      valid = false;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const res = await userService.changePassword({
        username: user?.userInfo?.username,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
      if (res.status === 200) {
        Alert.alert('密码修改成功', '您的密码已成功更新，请使用新密码登录', [
          {
            text: '确定',
            onPress: () => {
              // 清空表单
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              // 返回上一页
              dispatch({ type: 'Logout' });
            },
          },
        ]);
      }
    } catch (error) {
      console.log('修改密码错误：', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>当前密码</Text>
        <TextInput
          style={[
            styles.input,
            errors.currentPassword ? styles.inputError : null,
          ]}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="请输入当前密码"
          secureTextEntry
          autoCapitalize="none"
        />
        {errors.currentPassword ? (
          <Text style={styles.errorText}>{errors.currentPassword}</Text>
        ) : null}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>新密码</Text>
        <TextInput
          style={[styles.input, errors.newPassword ? styles.inputError : null]}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="请输入新密码（至少8位）"
          secureTextEntry
          autoCapitalize="none"
        />
        {errors.newPassword ? (
          <Text style={styles.errorText}>{errors.newPassword}</Text>
        ) : null}
        <Text style={styles.hintText}>
          密码应包含字母、数字和特殊字符，长度至少8位
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>确认新密码</Text>
        <TextInput
          style={[
            styles.input,
            errors.confirmPassword ? styles.inputError : null,
          ]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="请再次输入新密码"
          secureTextEntry
          autoCapitalize="none"
        />
        {errors.confirmPassword ? (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? '处理中...' : '确认修改'}
        </Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
  },
  hintText: {
    color: '#7f8c8d',
    fontSize: 13,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#9175be',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
