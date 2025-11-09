import React, { useContext, useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  View,
} from 'react-native';
import { UserDispatchContext } from '../state/UserContext';
import useUserService from '../service/UserService';
import { MyStackScreenProps } from '../common/NativeScreenTypes';
export const LoginScreen = ({ navigation }: MyStackScreenProps<'Login'>) => {
  const userService = useUserService();
  const dispatch = useContext(UserDispatchContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await userService.login({
        username: username,
        password: password,
      });
      if (res.data.code === '200') {
        dispatch({
          type: 'Login',
          user: {
            username: username,
            password: password,
            token: res.data.data,
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

  return (
    <ImageBackground
      source={require('../../assets/imgs/login-background.png')}
      style={styles.container}
    >
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        placeholder="用户名"
        onChangeText={text => setUsername(text)}
        value={username}
      />
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        placeholder="密码"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
    borderColor: 'gray',
    justifyContent: 'center',
  },
  error: {
    color: 'red',
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
