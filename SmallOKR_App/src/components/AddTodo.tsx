import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AndDesign from 'react-native-vector-icons/AntDesign';
import {DateCom} from './DateCom';
import {TodoService} from '../service/BusiService';

const Select = () => {
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();
  const onPress = () => {
    navigation.navigate('RepeatPage');
  };
  return (
    <View style={styles.repeatContainer}>
      <Text style={styles.rightIcon}>Repeat</Text>
      <AndDesign style={styles.rightIcon} name="right" onPress={onPress} />
    </View>
  );
};

const AddTodo = () => {
  const navigation = useNavigation();
  const [beginDate, seBeginDate] = useState<Date>(new Date());
  const [endDate, seEndDate] = useState<Date>(new Date());
  const [description, onChangeDescription] = useState('');
  const [todoName, onChangeTodoName] = useState('');

  const onOKBtnPress = () => {
    TodoService.AddTodo({
      name: todoName,
      description: description,
      beginDate: beginDate,
      endDate: endDate,
    })
      .then(res => {
        console.log('add todo', res.data);
        navigation.goBack();
      })
      .catch(reson => console.log(reson));
  };

  return (
    <View>
      <Text>name</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeTodoName}
        value={todoName}
        placeholder="Please input the todo name"
      />
      <Text>Description</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeDescription}
        value={description}
        placeholder="Please input the todo description"
      />
      <Select />
      <DateCom date={beginDate} onConfirm={d => seBeginDate(d)} />
      <DateCom date={endDate} onConfirm={d => seEndDate(d)} />
      <Button title="OK" onPress={onOKBtnPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  repeatContainer: {
    flexDirection: 'row',
  },
  rightIcon: {
    fontSize: 22,
  },
});

export default AddTodo;
