import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import useUserService from '../service/UserService';

export const ForgotPasswordScreen = ({ navigation }) => {
  // 状态管理
  const userService = useUserService();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [activeStep, setActiveStep] = useState(1); // 1: 邮箱验证, 2: 重置密码
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // 倒计时处理
  useEffect(() => {
    if (countdown > 0) {
      countdownRef.current = setTimeout(
        () => setCountdown(countdown - 1),
        1000,
      );
    }
    return () => {
      countdownRef.current && clearTimeout(countdownRef.current);
    };
  }, [countdown]);

  // 发送验证码
  const sendVerificationCode = async () => {
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      Alert.alert('提示', '请输入有效的邮箱地址');
      return;
    }

    try {
      // 这里替换为实际的API调用
      await userService.send({ email });
      setCountdown(60);
      setActiveStep(2);
      Alert.alert('已发送', '验证码已发送至您的邮箱');
    } catch (error) {
      Alert.alert('错误', '发送失败，请稍后重试');
    }
  };

  // 提交密码重置
  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('提示', '两次输入的密码不一致');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('提示', '密码长度不能少于6位');
      return;
    }

    try {
      // 这里替换为实际的API调用
      await userService.changePassword({ email, code, newPassword });
      Alert.alert('成功', '密码重置成功', [
        { text: '确定', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('错误', '重置失败，请检查验证码');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* 步骤指示器 */}
      <View style={styles.stepIndicator}>
        <View style={[styles.step, activeStep === 1 && styles.activeStep]}>
          <Text style={styles.stepText}>1</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={[styles.step, activeStep === 2 && styles.activeStep]}>
          <Text style={styles.stepText}>2</Text>
        </View>
      </View>

      {activeStep === 1 ? (
        // 第一步：邮箱验证
        <View style={styles.formContainer}>
          <Text style={styles.title}>找回密码</Text>
          <Text style={styles.subtitle}>请输入注册邮箱接收验证码</Text>

          <TextInput
            style={styles.input}
            placeholder="电子邮箱"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity
            style={[styles.button, countdown > 0 && styles.disabledButton]}
            onPress={sendVerificationCode}
            disabled={countdown > 0}
          >
            <Text style={styles.buttonText}>
              {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // 第二步：密码重置
        <View style={styles.formContainer}>
          <Text style={styles.title}>设置新密码</Text>
          <Text style={styles.subtitle}>验证码已发送至：{email}</Text>

          <TextInput
            style={styles.input}
            placeholder="验证码"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
            maxLength={6}
          />

          <TextInput
            style={styles.input}
            placeholder="新密码（至少6位）"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="确认新密码"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>确认重置</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.backLink}
        onPress={() =>
          activeStep === 1 ? navigation.goBack() : setActiveStep(1)
        }
      >
        <Text style={styles.backText}>
          {activeStep === 1 ? '返回登录' : '返回修改邮箱'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#007aff',
  },
  stepText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#a0c4ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  backLink: {
    marginTop: 24,
    alignSelf: 'center',
  },
  backText: {
    color: '#007aff',
    fontSize: 15,
  },
});

export default ForgotPasswordScreen;
