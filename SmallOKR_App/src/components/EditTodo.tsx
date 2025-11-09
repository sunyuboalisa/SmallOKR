import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useContext, useState } from 'react';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AndDesign from 'react-native-vector-icons/AntDesign';
import { DateCom } from './DateCom';
import useTodoService from '../service/TodoService';
import { TodoDispatchContext } from '../state/TodoContext';
import dayjs from 'dayjs';
import { ThemeContext } from '../state/ThemeContext';

type SelectProps = {
  handlePress: () => void;
};

const Select = ({ handlePress }: SelectProps) => {
  const themeContext = useContext(ThemeContext);
  return (
    <Pressable style={styles.repeatContainer} onPress={handlePress}>
      <Text
        style={{ ...styles.repeatText, color: themeContext?.theme.colors.text }}
      >
        重复设置
      </Text>
      <AndDesign
        name="right"
        size={16}
        color={themeContext?.theme.colors.text}
      />
    </Pressable>
  );
};

const EditTodo = () => {
  const todoService = useTodoService();
  const route = useRoute();
  const { todo } = route.params;
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();
  const dispatch = useContext(TodoDispatchContext);

  let initailBeginDate = new Date();
  let initailEndDate = new Date();
  const now = new Date();

  if (todo.dateTime != null) {
    const [hours, minutes] = todo.dateTime.split(':').map(Number);
    initailBeginDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
    );
  }

  if (todo.endTime != null) {
    const [hours, minutes] = todo.endTime.split(':').map(Number);
    initailEndDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
    );
  }

  const [beginDate, seBeginDate] = useState<Date>(initailBeginDate);
  const [endDate, seEndDate] = useState<Date>(initailEndDate);
  const [description, onChangeDescription] = useState('');
  const [todoName, onChangeTodoName] = useState(todo.title);

  const addTodo = async () => {
    try {
      const newTodo = {
        id: todo.id,
        name: todoName,
        description: description,
        beginDate: dayjs(beginDate).format('YYYY-MM-DD HH:mm:ss'),
        endDate: dayjs(endDate).format('YYYY-MM-DD HH:mm:ss'),
        status: '',
      };
      const addTodoRes = await todoService.addOrSaveTodo(newTodo);
      dispatch({ type: 'Reload', reload: true });
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const themeContext = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeContext?.theme.colors.background },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.inputContainer}>
          <Text
            style={{ ...styles.label, color: themeContext?.theme.colors.text }}
          >
            任务名称
          </Text>
          <TextInput
            style={{
              ...styles.input,
              backgroundColor: themeContext?.theme.colors.card,
              color: themeContext?.theme.colors.text,
              borderColor: themeContext?.theme.colors.border,
            }}
            onChangeText={onChangeTodoName}
            value={todoName}
            placeholder="输入任务名称"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text
            style={{ ...styles.label, color: themeContext?.theme.colors.text }}
          >
            任务描述
          </Text>
          <TextInput
            style={{
              ...styles.input,
              backgroundColor: themeContext?.theme.colors.card,
              color: themeContext?.theme.colors.text,
              borderColor: themeContext?.theme.colors.border,
              height: 80,
              textAlignVertical: 'top',
            }}
            onChangeText={onChangeDescription}
            value={description}
            placeholder="输入任务描述"
            multiline
          />
        </View>

        <View style={styles.timeContainer}>
          <View style={styles.timeInputContainer}>
            <Text
              style={{
                ...styles.label,
                color: themeContext?.theme.colors.text,
              }}
            >
              开始时间
            </Text>
            <DateCom date={beginDate} onConfirm={d => seBeginDate(d)} />
          </View>

          <View style={styles.timeInputContainer}>
            <Text
              style={{
                ...styles.label,
                color: themeContext?.theme.colors.text,
              }}
            >
              结束时间
            </Text>
            <DateCom date={endDate} onConfirm={d => seEndDate(d)} />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Select
            handlePress={() =>
              navigation.navigate('RepeatPage', { todoId: todo.id as string })
            }
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={{
            ...styles.button,
            backgroundColor: themeContext?.theme.colors.primary,
          }}
          onPress={addTodo}
        >
          <Text
            style={{
              ...styles.buttonText,
              color: themeContext?.theme.colors.text,
            }}
          >
            保存任务
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeInputContainer: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  repeatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  repeatText: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    marginHorizontal: 100,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EditTodo;
