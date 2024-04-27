import {View, Text, Modal} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  PlanContext,
  PlanDispatchContext,
} from '../state/PlanContext';
import {TimeLine} from './TimeLine';
import {axiosHelper} from '../util/AxiosHelper';
import {Todo} from '../model/OKRModel';


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

  useEffect(() => {
    axiosHelper
      .get<Todo[]>('api/v1/todo/getAll')
      .then(x => {
        let temp = x.data;
        dispatch({type: 'Load', newTodos: temp});
        console.log(temp);
      })
      .catch(e => console.log(e));
  }, [dispatch]);

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
