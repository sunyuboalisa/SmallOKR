import {
  ImageBackground,
  Modal,
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
      target: {description: '', name: '', id: ''},
    });
  };
  return <Ionicons name="add" style={styles.addBtn} onPress={onAddBtnPress} />;
};

const Target = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const targetContext = useContext(TargetContext);
  const dispatch = useContext(TargetDispatchContext);
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();
  const [selectedTarget, setSelectedTarget] = useState<ITarget>();
  const closeModal = () => {
    setModalVisible(false);
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
    <View
      style={styles.container}>
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
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
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
});

export {TargetHeaderRight, Target};
