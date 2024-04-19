import {View, Text, Modal} from 'react-native';
import React, {useContext, useState} from 'react';
import {StyleSheet} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PlanContext} from '../state/PlanContext';
import {TimeLine} from './TimeLine';

const items = [
  {
    title: 'January 2022',
    dateTime: 'Event 1',
  },
  {
    title: 'February 2022',
    dateTime: 'Event 2',
  },
  {
    title: 'March 2022',
    dateTime: 'Event 3',
  },
];

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
  return (
    <View style={styles.container}>
      <TimeLine data={items}/>
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
