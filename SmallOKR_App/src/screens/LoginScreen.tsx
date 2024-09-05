import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import { UserDispatchContext } from '../state/UserContext';
import { UserService } from '../service/BusiService';
import { axiosHelper } from '../util/AxiosHelper';

export const LoginScreen = ({ }) => {
  const dispatch = useContext(UserDispatchContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res=await UserService.login({ username: username, password: password });
      if (res.data.code === '200') {
        dispatch({
          type: 'Login',
          user: { username: username, password: password },
        });
        axiosHelper.setToken(res.data.data);
      } else {
        setError('用户名或密码错误');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/imgs/login-background.png')}
      style={styles.container}>
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
    height:50,
    marginTop:30,
    backgroundColor: '#007eff',
    marginHorizontal: 5,
    borderRadius:25,
    justifyContent:'center'
  },
  loginText: {
    fontSize: 24,
    textAlign: 'center',
    color:'white'
  },
});

export default LoginScreen;
