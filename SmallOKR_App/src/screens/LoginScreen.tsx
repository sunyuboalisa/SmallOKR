import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  View,
} from 'react-native';
import { UserContext, UserDispatchContext } from '../state/UserContext';
import useUserService from '../service/UserService';
import { MyStackScreenProps } from '../common/NativeScreenTypes';
import { useTheme } from '../state/ThemeContext';
export const LoginScreen = ({ navigation }: MyStackScreenProps<'Login'>) => {
  const { theme } = useTheme();
  const inputStyle = [
    styles.input,
    { color: theme.colors.text, borderColor: theme.colors.placeholder },
  ];
  const keyboardAppearance = theme.dark ? 'dark' : 'light';
  const userService = useUserService();
  const userContext = useContext(UserContext);
  const dispatch = useContext(UserDispatchContext);
  const [username, setUsername] = useState('test');
  const [password, setPassword] = useState('test');
  const [namespaceUrl, setNamespaceUrl] = useState(
    userContext.userInfo?.namespaceUrl || '',
  );
  const [error, setError] = useState('');
  const [errorNamespace, setErrorNamespace] = useState('');

  const handleLogin = async () => {
    try {
      // 1. 健康检查
      const resCheck = await userService.healthCheck(namespaceUrl);

      if (!resCheck) {
        setErrorNamespace('无法连接到服务器，请检查空间地址是否正确');
        return;
      } else {
        setErrorNamespace('');
      }

      // 2. 登录
      const res = await userService.login({
        username: username,
        password: password,
      });
      if (res && String(res.data.code) === '200') {
        const token = res.data.data;
        // 3. 更新 Context
        dispatch({
          type: 'Login',
          user: {
            username,
            password,
            token,
            namespaceUrl,
            status: 'online',
          },
        });
      } else {
        setError('用户名或密码错误');
      }
    } catch (error) {
      console.log(error);
      setError('登录失败，请稍后重试');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  useEffect(() => {
    setNamespaceUrl(userContext.userInfo?.namespaceUrl || '');
  }, [userContext.userInfo?.namespaceUrl]);

  return (
    <ImageBackground
      source={require('../../assets/imgs/login-background.png')}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      imageStyle={theme.dark ? styles.darkBackground : undefined}
    >
      <TextInput
        autoCapitalize="none"
        style={inputStyle}
        placeholder="用户名"
        placeholderTextColor={theme.colors.placeholder}
        keyboardAppearance={keyboardAppearance}
        onChangeText={text => setUsername(text)}
        value={username}
      />
      <TextInput
        autoCapitalize="none"
        style={inputStyle}
        placeholder="密码"
        placeholderTextColor={theme.colors.placeholder}
        keyboardAppearance={keyboardAppearance}
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      {error ? (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}
      <TextInput
        autoCapitalize="none"
        style={inputStyle}
        placeholder="空间地址"
        placeholderTextColor={theme.colors.placeholder}
        keyboardAppearance={keyboardAppearance}
        onChangeText={text => {
          setNamespaceUrl(text);
          dispatch({
            type: 'UpdateNamespaceUrl',
            namespaceUrl: text,
          });
        }}
        value={namespaceUrl}
      />
      {errorNamespace ? (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {errorNamespace}
        </Text>
      ) : null}
      <TouchableOpacity onPress={handleLogin} style={styles.login}>
        <Text children="登录" style={styles.loginText} />
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.linkText}>忘记密码?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.linkText}>注册账号</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  darkBackground: {
    opacity: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  error: {
    marginBottom: 10,
  },
  login: {
    width: '80%',
    height: 50,
    marginTop: 30,
    backgroundColor: '#007eff',
    marginHorizontal: 5,
    borderRadius: 25,
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  linkText: {
    color: '#007eff',
    fontSize: 16,
  },
});

export default LoginScreen;
