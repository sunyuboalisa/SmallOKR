import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {UserDispatchContext} from '../state/UserContext';
import {UserService} from '../service/BusiService';
import {axiosHelper} from '../util/AxiosHelper';

export const LoginScreen = ({}) => {
  const dispatch = useContext(UserDispatchContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    UserService.login({username: username, password: password})
      .then(res => {
        if (res.data.code === '200') {
          dispatch({
            type: 'Login',
            user: {username: username, password: password},
          });
          console.log('登录:', res.data.data);
          axiosHelper.setToken(res.data.data);
        } else {
          setError('用户名或密码错误');
        }
      })
      .catch(err => Alert.alert(err));
  };

  return (
    <View style={styles.container}>
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
    </View>
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
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  login: {
    width: '100%',
    backgroundColor: 'blue',
    marginHorizontal: 5,
  },
  loginText: {
    fontSize: 24,
    textAlign: 'center',
  },
});

export default LoginScreen;
