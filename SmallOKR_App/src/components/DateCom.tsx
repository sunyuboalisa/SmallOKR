import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AndDesign from 'react-native-vector-icons/AntDesign';
import { ThemeContext } from '../state/ThemeContext';

interface DateComProps {
  date: Date;
  onConfirm: (date: Date) => void;
}

const DateCom = ({ date, onConfirm }: DateComProps) => {
  // modalVisible 控制自定义 Modal 的显示
  const [modalVisible, setModalVisible] = useState(false);
  // tempDate 用于在模态框内临时存储用户的修改，直到点击确认
  const [tempDate, setTempDate] = useState(date);
  const themeContext = useContext(ThemeContext);

  const handleNativeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
      console.log('Native date selected:', selectedDate.toString());
    }

    // 如果是 Android 的命令式 API，它自带确认按钮，我们可以直接处理并关闭
    if (Platform.OS === 'android' && event.type === 'set') {
      onConfirm(selectedDate as Date);
      setModalVisible(false); // 尽管 Android 不需要 Modal，但为了统一流程
    }
    // 在 iOS 滚轮模式下，这里只更新 tempDate，不关闭 Modal
  };

  // 仅在 Android 上使用命令式 API 弹出
  const showAndroidPicker = () => {
    import('@react-native-community/datetimepicker').then(
      ({ DateTimePickerAndroid }) => {
        DateTimePickerAndroid.open({
          value: date,
          onChange: handleNativeChange,
          mode: 'time',
          is24Hour: true,
          display: 'default',
        });
      },
    );
  };

  const showPicker = () => {
    if (Platform.OS === 'android') {
      showAndroidPicker();
    } else {
      // iOS: 显示自定义模态框，并同步初始日期
      setTempDate(date);
      setModalVisible(true);
    }
  };

  const handleConfirm = () => {
    onConfirm(tempDate);
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  console.log('DateCom render with date:', date.toString());
  return (
    <View style={styles.repeatContainer}>
      {/* 1. UI 显示部分 */}
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
        onPress={showPicker}
      />

      {/* 2. 自定义 Modal (仅限 iOS 使用) */}
      {Platform.OS === 'ios' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCancel}
        >
          <Pressable style={styles.modalOverlay} onPress={handleCancel}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: themeContext?.theme.colors.card },
              ]}
            >
              {/* 滚轮选择器，始终使用 'spinner' 确保它稳定 */}
              <DateTimePicker
                value={tempDate}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={handleNativeChange}
                style={{ width: '100%', height: 180 }}
              />

              {/* 确认和取消按钮 */}
              <View style={styles.buttonRow}>
                <Pressable onPress={handleCancel} style={styles.modalButton}>
                  <Text style={{ color: themeContext?.theme.colors.text }}>
                    取消
                  </Text>
                </Pressable>
                <Pressable onPress={handleConfirm} style={styles.modalButton}>
                  <Text
                    style={{
                      color: themeContext?.theme.colors.primary,
                      fontWeight: 'bold',
                    }}
                  >
                    确认
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
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
  // --- Modal 样式 ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景遮罩
  },
  modalContent: {
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalButton: {
    padding: 10,
  },
});
