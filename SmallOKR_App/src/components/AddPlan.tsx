import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useContext, useState} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import AndDesign from 'react-native-vector-icons/AntDesign';
import { PlanDispatchContext } from '../state/PlanContext';

const Select = () => {
  const navigation = useNavigation<NavigationProp<MyReactNavigation.ParamList>>();
  const onPress = () => {
    navigation.navigate('RepeatPage');
  };
  return (
    <View style={styles.repeatContainer}>
      <Text style={styles.rightIcon}>Repeat</Text>
      <AndDesign style={styles.rightIcon} name="right" onPress={onPress} />
    </View>
  );
};

const DateSelect = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.repeatContainer}>
      <Text style={styles.rightIcon}>Start Time</Text>
      <AndDesign
        style={styles.rightIcon}
        name="calendar"
        onPress={() => setOpen(true)}
      />
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

const DateSelectEnd = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.repeatContainer}>
      <Text style={styles.rightIcon}>End Time</Text>
      <AndDesign
        style={styles.rightIcon}
        name="calendar"
        onPress={() => setOpen(true)}
      />
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

const AddPlan = () => {
  const dispatch=useContext(PlanDispatchContext);
  const navigation = useNavigation();
  const onOKBtnPress = () => {
    dispatch({type:'Add'});
    navigation.goBack();
  };
  const [description, onChangeDescription] = useState('');
  const [todoName, onChangeTodoName] = useState('');

  return (
    <View>
      <Text>Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeTodoName}
        value={todoName}
        placeholder="Please input the todo name"
      />
      <Text>Description</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeDescription}
        value={description}
        placeholder="Please input the todo description"
      />
      <Select />
      <DateSelect />
      <DateSelectEnd />
      <Button title="OK" onPress={onOKBtnPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  repeatContainer: {
    flexDirection: 'row',
  },
  rightIcon: {
    fontSize: 22,
  },
});

export default AddPlan;
