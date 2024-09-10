import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useContext, useState} from 'react';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AndDesign from 'react-native-vector-icons/AntDesign';
import {DateCom} from './DateCom';
import {TodoService} from '../service/BusiService';
import {TodoDispatchContext} from '../state/TodoContext';

type SelectProps = {
  handlePress: () => void;
};
const Select = ({handlePress}: SelectProps) => {
  return (
    <View style={styles.repeatContainer}>
      <Text style={styles.rightIcon}>重复：</Text>
      <AndDesign style={styles.rightIcon} name="right" onPress={handlePress} />
    </View>
  );
};

const AddTodo = () => {
  const route = useRoute();
  const {todo} = route.params;
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();
  const dispatch = useContext(TodoDispatchContext);
  const [beginDate, seBeginDate] = useState<Date>(new Date());
  const [endDate, seEndDate] = useState<Date>(new Date());
  const [description, onChangeDescription] = useState('');
  const [todoName, onChangeTodoName] = useState(todo.title);

  const addTodo = async () => {
    try {
      const newTodo = {
        id: todo.id,
        name: todoName,
        description: description,
        beginDate: beginDate,
        endDate: endDate,
        status: '',
      };
      console.log('add todo', newTodo);
      const addTodoRes = await TodoService.AddOrSaveTodo(newTodo);
      dispatch({type: 'Reload', reload: true});
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };
  const onOKBtnPress = () => {
    addTodo();
  };

  const onPress = () => {
    navigation.navigate('RepeatPage', {todoId: todo.id as string});
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <Text>名字：</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeTodoName}
          value={todoName}
          placeholder="待办名字"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>描述：</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeDescription}
          value={description}
          placeholder="待办描述"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>开始时间：</Text>
        <DateCom date={beginDate} onConfirm={d => seBeginDate(d)} />
      </View>
      <View style={styles.inputContainer}>
        <Text>结束时间：</Text>
        <DateCom date={endDate} onConfirm={d => seEndDate(d)} />
      </View>
      <View style={styles.inputContainer}>
        <Select handlePress={onPress} />
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Pressable style={styles.okBtn} onPress={onOKBtnPress}>
          <Text style={styles.btnText}>确定</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 20,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  repeatContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    textAlign: 'center',
  },
  okBtn: {
    alignItems: 'center',
    width: '80%',
    height: 50,
    marginTop: 50,
    backgroundColor: '#007eff',
    marginHorizontal: 5,
    borderRadius: 25,
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
  },
});

export default AddTodo;
