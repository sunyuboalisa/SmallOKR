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

const PlanHeaderRight = () => {
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();
  const onAddBtnPress = () => {
    navigation.navigate('AddTodo', {
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
  return <Ionicons name="add" style={{fontSize: 24}} onPress={onAddBtnPress} />;
};

const Todo = () => {
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const planContext = useContext(TodoContext);
  const dispatch = useContext(TodoDispatchContext);
  const [selectedTodo, setSelectedTodo] = useState();

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleItemPress = (data: any) => {
    navigation.navigate('AddTodo', {
      todo: data,
    });
  };

  const handleItemLongPress = (data: any) => {
    setSelectedTodo(data);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      console.log('删除todo：', selectedTodo);
      const res = await TodoService.deleteTodo(selectedTodo.id);
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
      console.log(localDateTime);
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
        data={planContext.uiTodos}
        handleItemPress={handleItemPress}
        handleItemLongPress={handleItemLongPress}
      />
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={closeModal}>
        <View style={styles.modalMask}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => handleDelete()}
              style={styles.modalBtn}>
              <Text style={styles.modalSize}>删除</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={styles.modalBtn}>
              <Text style={styles.modalSize}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  modalMask: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    flexDirection: 'column',
    marginBottom: 100,
  },
  modalSize: {
    fontSize: 24,
  },
  modalBtn: {
    minWidth: 300,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    alignItems: 'center',
  },
});

export {PlanHeaderRight, Todo};
