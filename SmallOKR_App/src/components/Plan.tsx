'use strict'
import {View, Text, Modal} from 'react-native';
import React, {useContext, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PlanContext} from '../state/PlanContext';

const items = [
  {
    title: "January 2022",
    cardTitle: "Event 1",
    cardSubtitle: "Event 1 Subtitle",
    cardDetailedText: "This is the first event on the timeline.",
  },
  {
    title: "February 2022",
    cardTitle: "Event 2",
    cardSubtitle: "Event 2 Subtitle",
    cardDetailedText: "This is the second event on the timeline.",
  },
  {
    title: "March 2022",
    cardTitle: "Event 3",
    cardSubtitle: "Event 3 Subtitle",
    cardDetailedText: "This is the third event on the timeline.",
  }
];


const screenWidth = Dimensions.get('window').width - 50;

const PlanHeaderRight = () => {
  const navigation = useNavigation<NavigationProp<MyReactNavigation.ParamList>>();

  const onAddBtnPress = () => {
    navigation.navigate('AddPlan');
  };
  return <Ionicons name="add" onPress={onAddBtnPress} />;
};

const Plan = () => {
  const [isVisible, setVisible] = useState(false);
  const planContext = useContext(PlanContext);
  return (
    <View>
      

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
		paddingTop:65,
    backgroundColor:'white'
  },
  list: {
    flex: 1,
    marginTop:20,
  },
  closeText: {
    fontSize: 24,
    color: '#00479e',
    textAlign: 'center',
  },
  renderItemText: {
    padding: 5,
    fontSize: 22,
    textAlign: 'left',
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal:8,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export {PlanHeaderRight, Plan};
