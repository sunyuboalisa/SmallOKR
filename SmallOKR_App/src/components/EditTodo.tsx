import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import AndDesign from 'react-native-vector-icons/AntDesign';
import { DateCom } from './DateCom';
import useTodoService from '../service/TodoService';
import { TodoDispatchContext } from '../state/TodoContext';
import dayjs from 'dayjs';
import { ThemeContext } from '../state/ThemeContext';
import { MyStackScreenProps } from '../common/NativeScreenTypes';
import { ITodo } from '../model/OKRModel';
import { RepeatModal, RepeatUIModel } from './RepeatModal';
import { useUUID } from '../hooks/useUUID';

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
const parseBackendDate = (str: string | null) => {
  if (!str) return new Date();
  const hasDate = str.includes('-');
  const fullStr = hasDate ? str : `${dayjs().format('YYYY-MM-DD')} ${str}`;

  const d = dayjs(fullStr, 'YYYY-MM-DD HH:mm:ss');
  const date = d.isValid() ? d.toDate() : new Date();
  console.log('parsed date:', date.toString());

  return date;
};

const EditTodo = ({ route, navigation }: MyStackScreenProps<'EditTodo'>) => {
  const todoService = useTodoService();
  const { generateUUID } = useUUID();
  const { todo } = route.params;
  const dispatch = useContext(TodoDispatchContext);
  const themeContext = useContext(ThemeContext);

  const [todoName, onChangeTodoName] = useState(todo.name);
  const [description, onChangeDescription] = useState(todo.description || '');
  const [beginDate, seBeginDate] = useState<Date>(() =>
    parseBackendDate(todo.beginDate),
  );

  const [endDate, seEndDate] = useState<Date>(() =>
    parseBackendDate(todo.endDate),
  );
  const [repeat, setRepeat] = useState<RepeatUIModel[]>();
  const [isRepeatModalVisible, setIsRepeatModalVisible] = useState(false);
  const addTodo = async () => {
    try {
      console.log('Todo :', todo.id);
      const newTodo: ITodo = {
        id: todo.id || generateUUID(),
        name: todoName,
        description: description,
        beginDate: dayjs(beginDate).format('YYYY-MM-DD HH:mm:ss'),
        endDate: dayjs(endDate).format('YYYY-MM-DD HH:mm:ss'),
        status: todo.status || 0,
      };

      console.log('New todo to save:', newTodo);
      await todoService.addOrSaveTodo(newTodo);

      // 保存重复周期
      const selectedRepeats = repeat
        ?.filter(r => r.selected)
        .map(r => ({
          todoRepeatId: r.todoRepeatId,
          todoId: newTodo.id as string,
          repeatId: r.repeatId,
        }));
      console.log('selectedRepeats :', selectedRepeats);
      const unselectedRepeatIds = repeat
        ?.filter(r => !r.selected && r.todoRepeatId)
        .map(r => r.todoRepeatId);

      console.log('unselectedRepeatIds :', unselectedRepeatIds);

      // 批量删除
      if (unselectedRepeatIds && unselectedRepeatIds.length > 0) {
        await todoService.deleteRepeat(unselectedRepeatIds);
      }
      // 再添加选中的重复周期
      if (selectedRepeats && selectedRepeats.length > 0)
        await todoService.addRepeat(selectedRepeats);

      try {
        const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const localDateTime = now;

        const res = await todoService.getTodosByDate(localDateTime);
        const todos = res.data.data;

        dispatch({ type: 'Load', newTodos: todos });
      } catch (error) {
        console.log('error in fetch user todos:', error);
      }
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };
  const mergeTimeWithOriginalDate = (originalDate: Date, newTimeDate: Date) => {
    // 使用 dayjs 简化时间合并操作
    const originalDayjs = dayjs(originalDate);
    const newTimeDayjs = dayjs(newTimeDate);
    console.log(
      'confirm date: ',
      originalDate.toString(),
      newTimeDate.toString(),
    );

    // 将新时间（小时、分钟）设置到原始日期上，秒数清零以保持统一
    const mergedDayjs = originalDayjs
      .hour(newTimeDayjs.hour())
      .minute(newTimeDayjs.minute())
      .second(0);

    return mergedDayjs.toDate();
  };

  useEffect(() => {
    console.log('EditTodo loaded with todo:', todo);

    const fetchData = async () => {
      try {
        const repeatDicRes = await todoService.getRepeatDicEntrys();
        const todoRepeatRes = await todoService.getRepeat(todo.id);

        const todoRepeats = todoRepeatRes.data.data;
        console.log('Fetched todo repeats:', todoRepeats);
        const resData = repeatDicRes.data.data.map(
          (item: { id: any; entryValue: any }) => {
            let entry = {
              todoRepeatId: '',
              repeatId: item.id,
              title: item.entryValue,
              selected: false,
            };

            todoRepeats.forEach(
              (element: { repeatId: any; todoRepeatId: string }) => {
                if (element.repeatId === item.id) {
                  entry.todoRepeatId = element.todoRepeatId;
                  entry.selected = true;
                }
              },
            );

            return entry;
          },
        );
        console.log('Fetched repeat data:', resData);
        setRepeat(resData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [todo, todoService]);
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
            <DateCom
              date={beginDate}
              onConfirm={d =>
                seBeginDate(mergeTimeWithOriginalDate(beginDate, d))
              }
            />
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
            <DateCom
              date={endDate}
              onConfirm={d => seEndDate(mergeTimeWithOriginalDate(endDate, d))}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Select handlePress={() => setIsRepeatModalVisible(true)} />
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
      <RepeatModal
        isVisible={isRepeatModalVisible}
        onClose={function (): void {
          setIsRepeatModalVisible(false);
        }}
        onSave={function (selectedItems: RepeatUIModel[]): void {
          setIsRepeatModalVisible(false);
          setRepeat(selectedItems);
        }}
        repeats={repeat || []}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 12, padding: 16, marginBottom: 16 },
  inputContainer: { marginBottom: 20 },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeInputContainer: { width: '48%' },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
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
  repeatText: { fontSize: 16 },
  buttonContainer: { marginTop: 8 },
  button: {
    marginHorizontal: 100,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { fontSize: 18, fontWeight: '600' },
});

export default EditTodo;
