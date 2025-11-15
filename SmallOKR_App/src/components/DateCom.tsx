import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import AndDesign from 'react-native-vector-icons/AntDesign';
import { ThemeContext } from '../state/ThemeContext';
// 日期格式统一为 HH:mm，UI显示时间部分 为 HH:mm
interface DateComProps {
  date: Date;
  onConfirm: (date: Date) => void;
}

const DateCom = ({ date, onConfirm }: DateComProps) => {
  const [open, setOpen] = useState(false);
  const themeContext = useContext(ThemeContext);

  return (
    <View style={styles.repeatContainer}>
      <Text
        style={{
          marginRight: 10,
          textAlignVertical: 'center',
          color: themeContext?.theme.colors.text,
        }}
      >
        {dayjs(date).format('HH:mm')}
      </Text>

      <AndDesign
        style={{ ...styles.rightIcon, color: themeContext?.theme.colors.text }}
        name="calendar"
        onPress={() => setOpen(true)}
      />

      <DatePicker
        modal
        mode="time"
        open={open}
        date={date}
        onConfirm={e => {
          setOpen(false);
          onConfirm(e);
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
};

export { DateCom };

const styles = StyleSheet.create({
  repeatContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    fontSize: 22,
  },
});
