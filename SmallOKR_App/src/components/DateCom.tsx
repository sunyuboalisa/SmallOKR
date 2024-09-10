import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import AndDesign from 'react-native-vector-icons/AntDesign';

interface DateComProps {
  date: Date;
  onConfirm: (date: Date) => void;
}

const DateCom = ({date, onConfirm}: DateComProps) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.repeatContainer}>
      <Text style={{marginRight: 10, textAlignVertical: 'center'}}>
        {date.toLocaleDateString()}
      </Text>
      <AndDesign
        style={styles.rightIcon}
        name="calendar"
        onPress={() => setOpen(true)}
      />
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={e => {
          setOpen(false);
          onConfirm(e);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

export {DateCom};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  repeatContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    fontSize: 22,
  },
});
