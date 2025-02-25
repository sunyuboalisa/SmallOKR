import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {TargetContext, TargetDispatchContext} from '../state/TargetContext';
import {Card} from './Card';
import {getColor} from '../theme';
import {TargetService} from '../service/BusiService';
import {ITarget} from '../model/OKRModel';

const TargetHeaderRight = () => {
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();

  const onAddBtnPress = () => {
    navigation.navigate('AddTarget', {
      target: {description: '', name: '', id: '', status: '0'},
    });
  };
  return <Ionicons name="add" style={styles.addBtn} onPress={onAddBtnPress} />;
};

const Target = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const targetContext = useContext(TargetContext);
  const dispatch = useContext(TargetDispatchContext);
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();
  const [selectedTarget, setSelectedTarget] = useState<ITarget>();
  const closeModal = () => {
    setModalVisible(false);
  };

  const closeLogModal = () => {
    setLogModalVisible(false);
  };
  const handlePress = (target: ITarget) => {
    navigation.navigate('AddTarget', {target: target});
  };
  const handleLongPress = (target: ITarget) => {
    setSelectedTarget(target);
    setModalVisible(true);
  };
  const handleDelete = () => {
    console.log('删除目标：', selectedTarget);
    if (selectedTarget) {
      TargetService.deleteTarget(selectedTarget.id)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
    TargetService.getTargets()
      .then(res => {
        let data = res.data.data;
        const newState = data.map(
          (value: {id: any; name: any; description: any}) => {
            let entry = {
              id: value.id,
              name: value.name,
              description: value.description,
            };
            return entry;
          },
        );
        dispatch({type: 'Load', targets: newState});
      })
      .catch(e => console.log('targets error：', e));
    setModalVisible(false);
  };
  const handleCommitDayLog = () => {
    closeModal();
    setLogModalVisible(true);
  };
  const handleFinishTarget = async () => {
    const res = await TargetService.saveTarget({
      ...selectedTarget,
      status: '2',
    });
    closeModal();
  };
  const handleOKBtnPress = async () => {
    closeLogModal();
  };
  useEffect(() => {
    TargetService.getTargets()
      .then(res => {
        let data = res.data.data;
        const newState = data.map(
          (value: {id: any; name: any; description: any}) => {
            let entry = {
              id: value.id,
              name: value.name,
              description: value.description,
            };
            return entry;
          },
        );
        dispatch({type: 'Load', targets: newState});
      })
      .catch(e => console.log('targets error：', e));
  }, [dispatch, targetContext.reload]);

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item, index) => item.name + index}
        renderItem={({item, index}) => {
          return (
            <Card
              color={getColor(index)}
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
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalMask}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => handleCommitDayLog()}
              style={styles.modalBtn}>
              <Text style={styles.modalSize}>提交今日进度</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleFinishTarget()}
              style={styles.modalBtn}>
              <Text style={styles.modalSize}>完成</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete()}
              style={styles.modalBtn}>
              <Text style={styles.modalSize}>删除</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={styles.modalBtn}>
              <Text style={styles.modalSize}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={logModalVisible}
        animationType="slide"
        onRequestClose={closeLogModal}>
        <View style={styles.modalMask}>
          <View style={styles.resultsContainer}></View>
          <View style={styles.okBtnContainer}>
            <Pressable style={styles.okBtn} onPress={handleOKBtnPress}>
              <Text style={styles.btnText}>确定</Text>
            </Pressable>
          </View>
        </View>
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
    color: '#ffffff',
  },
  modalMask: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0,0.6)',
  },
  modalContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'column',
    marginBottom: 100,
  },
  modalSize: {
    fontSize: 24,
  },
  modalBtn: {
    minWidth: 300,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    alignItems: 'center',
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

export {TargetHeaderRight, Target};
