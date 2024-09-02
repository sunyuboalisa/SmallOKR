import {View, Text, Modal} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TodoContext, TodoDispatchContext} from '../state/TodoContext';
import {TimeLine} from './TimeLine';
import {TodoService} from '../service/BusiService';

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
  return <Ionicons name="add" onPress={onAddBtnPress} />;
};

const Plan = () => {
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();
  const [isVisible, setVisible] = useState(false);
  const planContext = useContext(TodoContext);
  const dispatch = useContext(TodoDispatchContext);

  const handleItemPress = (data: any) => {
    navigation.navigate('AddTodo', {
      todo: data,
    });
  };

  const fetchData = async () => {
    try {
      const res = await TodoService.getTodos();
      const todos = res.data.data;
      dispatch({type: 'Load', newTodos: todos});
      console.log('user todos:', todos);
    } catch (error) {
      console.log('error in fetch user todos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [planContext.reload]);

  return (
    <View style={styles.container}>
      <TimeLine data={planContext.uiTodos} handleItemPress={handleItemPress} />
      <Modal animationType="slide" visible={isVisible} transparent={false}>
        <Text style={styles.closeText} onPress={() => setVisible(!isVisible)}>
          Close
        </Text>
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
});

export {PlanHeaderRight, Plan};
