import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TargetContext, TargetDispatchContext } from '../state/TargetContext';
import { Card } from './Card';
import useTargetService from '../service/TargetService';
import { ITarget } from '../model/OKRModel';
import { ThemeContext } from '../state/ThemeContext';
import {
  MyStackParamList,
  MyStackScreenProps,
} from '../common/NativeScreenTypes';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const TargetHeaderRight = () => {
  const themeContext = useContext(ThemeContext);
  const navigation = useNavigation<NavigationProp<MyStackParamList>>();
  const onAddBtnPress = () => {
    navigation.navigate('EditTarget', {
      target: { description: '', name: '', id: '', status: 0 },
    });
  };
  return (
    <Ionicons
      name="add"
      style={{ ...styles.addBtn, color: themeContext?.theme.colors.text }}
      onPress={onAddBtnPress}
    />
  );
};

const Target = ({ navigation }: MyStackScreenProps<'Target'>) => {
  const targetService = useTargetService();
  const themeContext = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const targetContext = useContext(TargetContext);
  const dispatch = useContext(TargetDispatchContext);
  const [selectedTarget, setSelectedTarget] = useState<ITarget>();
  const closeModal = () => {
    setModalVisible(false);
  };
  const handlePress = (target: ITarget) => {
    navigation.navigate('EditTarget', { target: target });
  };
  const handleLongPress = (target: ITarget) => {
    setSelectedTarget(target);
    setModalVisible(true);
  };
  const handleDelete = async () => {
    if (selectedTarget) {
      try {
        await targetService.deleteTarget(selectedTarget.id);
        dispatch({ type: 'Delete', targetId: selectedTarget.id });
      } catch (error) {
        console.error('删除目标失败：', error);
        return;
      }
    }
    setModalVisible(false);
  };
  const handleEditTarget = () => {
    if (selectedTarget)
      navigation.navigate('EditTarget', { target: selectedTarget });
    closeModal();
  };
  const handleFinishTarget = async () => {
    if (selectedTarget) {
      await targetService.saveTarget({
        ...selectedTarget,
        status: 2,
      });
      closeModal();
    }
  };

  useEffect(() => {
    const loadTargets = async () => {
      try {
        const res = await targetService.getTargets();
        let data = res.data.data;
        const newState = data.map(
          (value: { id: any; name: any; description: any }) => ({
            id: value.id,
            name: value.name,
            description: value.description,
          }),
        );

        dispatch({ type: 'Load', targets: newState });
      } catch (e) {
        console.log('targets error：', e);
      }
    };

    // loadTargets();
  }, [dispatch, targetService]);

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: themeContext?.theme.colors.background,
      }}
    >
      <FlatList
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item, index }) => {
          return (
            <Card
              key={index}
              color={themeContext?.theme.colors.card}
              description={item.description}
              title={item.name}
              handlePress={() => handlePress(item)}
              handleLongPress={() => handleLongPress(item)}
            />
          );
        }}
        data={targetContext.targets}
      />
      <Modal
        animationType="fade" // 改为淡入淡出动画
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalMask}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View style={styles.modalOuterContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandle} />

              <TouchableOpacity
                onPress={() => {
                  handleFinishTarget();
                  closeModal();
                }}
                style={styles.modalBtn}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  style={styles.modalBtnIcon}
                />
                <Text style={styles.modalBtnText}>标记完成目标</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleEditTarget();
                }}
                style={styles.modalBtn}
              >
                <Ionicons
                  name="create-outline"
                  size={22}
                  style={styles.modalBtnIcon}
                />
                <Text style={styles.modalBtnText}>编辑目标</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.modalBtn, styles.lastModalBtn]}
              >
                <Ionicons
                  name="trash-outline"
                  size={22}
                  style={[styles.modalBtnIcon, styles.dangerIcon]}
                />
                <Text style={[styles.modalBtnText, styles.dangerText]}>
                  删除任务
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
  },
  addBtn: {
    fontSize: 24,
  },
  modalMask: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOuterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40, // 控制底部距离
  },
  modalContent: {
    width: '100%',
    maxWidth: 400, // 限制最大宽度
    backgroundColor: '#FFF',
    borderRadius: 16, // 统一圆角
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },
  modalBtn: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEEEEE',
  },
  lastModalBtn: {
    borderBottomWidth: 0, // 最后一项无边框
  },
  modalBtnText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  modalBtnIcon: {
    marginRight: 16,
    color: '#666',
  },
  dangerIcon: {
    color: '#FF3B30',
  },
  dangerText: {
    color: '#FF3B30',
  },
  resultsContainer: {
    flex: 2,
    alignItems: 'center',
  },
  okBtnContainer: {
    flex: 1,
    alignItems: 'center',
  },
  okBtn: {
    width: '80%',
    height: 50,
    marginTop: 30,
    backgroundColor: '#007eff',
    borderRadius: 8,
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white',
  },
});

export { TargetHeaderRight, Target };
