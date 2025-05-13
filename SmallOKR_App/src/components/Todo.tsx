import {View, Text, Modal, TouchableOpacity} from 'react-native';
import React, {useContext, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TodoContext, TodoDispatchContext} from '../state/TodoContext';
import {TimeLine} from './TimeLine';
import {TodoService} from '../service/BusiService';
import dayjs from 'dayjs';
import {ThemeContext} from '../state/ThemeContext';

const PlanHeaderRight = () => {
  const themeContext = useContext(ThemeContext);
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();
  const onAddBtnPress = () => {
    navigation.navigate('EditTodo', {
      todo: {
        name: 'string',
        description: 'string',
        beginDate: 'string',
        endDate: 'string',
        repeat: 1,
        id: '',
      },
    });
  };
  return (
    <Ionicons
      name="add"
      style={{...styles.addBtn, color: themeContext?.theme.colors.text}}
      onPress={onAddBtnPress}
    />
  );
};

const Todo = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState();

  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();
  // const themeContext = useContext(ThemeContext);
  const todoContext = useContext(TodoContext);
  const dispatch = useContext(TodoDispatchContext);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleItemPress = (data: any) => {
    navigation.navigate('EditTodo', {
      todo: data,
    });
  };

  const handleItemLongPress = (data: any) => {
    setSelectedTodo(data);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      const res = await TodoService.deleteTodo(selectedTodo.id);
      console.log('删除todo：', selectedTodo);
      console.log(res.data);
      closeModal();
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
      const localDateTime = now;
      const res = await TodoService.getTodosByDate(localDateTime);
      const todos = res.data.data;
      dispatch({type: 'Load', newTodos: todos});
    } catch (error) {
      console.log('error in fetch user todos:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  return (
    <View style={styles.container}>
      <TimeLine
        data={todoContext.uiTodos}
        handleItemPress={handleItemPress}
        handleItemLongPress={handleItemLongPress}
      />
      <Modal
        animationType="fade" // 改为淡入淡出动画
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <TouchableOpacity
          style={styles.modalMask}
          activeOpacity={1}
          onPress={closeModal}>
          <View style={styles.modalOuterContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />

              <TouchableOpacity onPress={handleDelete} style={styles.modalBtn}>
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  style={styles.modalBtnIcon}
                />
                <Text style={styles.modalBtnText}>标记完成待办</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleItemPress(selectedTodo);
                  closeModal();
                }}
                style={styles.modalBtn}>
                <Ionicons
                  name="create-outline"
                  size={22}
                  style={styles.modalBtnIcon}
                />
                <Text style={styles.modalBtnText}>编辑待办</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.modalBtn, styles.lastModalBtn]}>
                <Ionicons
                  name="trash-outline"
                  size={22}
                  style={[styles.modalBtnIcon, styles.dangerIcon]}
                />
                <Text style={[styles.modalBtnText, styles.dangerText]}>
                  删除待办
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  closeText: {
    fontSize: 24,
    color: '#00479e',
    textAlign: 'center',
  },

  modalSize: {
    fontSize: 24,
  },
  addBtn: {
    fontSize: 24,
  },
  modalMask: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOuterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40, // 控制底部距离
  },
  modalContent: {
    width: '100%',
    maxWidth: 400, // 限制最大宽度
    backgroundColor: '#FFF',
    borderRadius: 16, // 统一圆角
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },
  modalBtn: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEEEEE',
  },
  lastModalBtn: {
    borderBottomWidth: 0, // 最后一项无边框
  },
  modalBtnText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  modalBtnIcon: {
    marginRight: 16,
    color: '#666',
  },
  dangerIcon: {
    color: '#FF3B30',
  },
  dangerText: {
    color: '#FF3B30',
  },
});

export {PlanHeaderRight, Todo};
