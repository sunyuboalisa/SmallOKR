import {View, Text, Modal} from 'react-native';
import React, {useContext, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PlanContext, PlanDispatchContext} from '../state/PlanContext';
import {TimeLine} from './TimeLine';
import {TodoService} from '../service/BusiService';

const PlanHeaderRight = () => {
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();

  const onAddBtnPress = () => {
    navigation.navigate('AddPlan');
  };
  return <Ionicons name="add" onPress={onAddBtnPress} />;
};

const Plan = () => {
  const [isVisible, setVisible] = useState(false);
  const planContext = useContext(PlanContext);
  const dispatch = useContext(PlanDispatchContext);

  useFocusEffect(
    React.useCallback(() => {
      TodoService.getTodos()
        .then(x => {
          let temp = x.data.data;
          dispatch({type: 'Load', newTodos: temp});
          console.log('user todos:', temp);
        })
        .catch(e => console.log(e));
    }, [dispatch]),
  );

  return (
    <View style={styles.container}>
      <TimeLine data={planContext.uiTodos} />
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
