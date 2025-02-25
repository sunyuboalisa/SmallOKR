import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TargetService} from '../service/BusiService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TargetContext, TargetDispatchContext} from '../state/TargetContext';

const AddTarget = () => {
  const route = useRoute();
  const {target} = route.params;
  const navigation = useNavigation();
  const [description, onChangeDescription] = useState(target.description);
  const [targetName, onChangeTargetName] = useState(target.name);
  const targetContext = useContext(TargetContext);
  const dispatch = useContext(TargetDispatchContext);

  const onAddBtnPress = () => {
    console.log('current target: ', target);
    dispatch({
      type: 'AddResult',
      newResult: {
        id: '',
        targetId: target.id,
        name: 'test',
        value: 'test',
        creTime: new Date(),
      },
    });
  };

  const handleOKBtnPress = async () => {
    try {
      const addTargetRes = await TargetService.saveTarget({
        name: targetName,
        description: description,
        id: target.id,
        status: '0',
      });
      const addResultRes = await TargetService.saveResult(
        targetContext.results,
      );
      console.log(addTargetRes.status);
      console.log(addResultRes.status);
      const getTargetsRes = await TargetService.getTargets();
      let data = getTargetsRes.data.data;
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
      dispatch({type: 'Reload', reload: true});
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const featchData = async () => {
    try {
      const res = await TargetService.getResults({targetId: target.id});
      console.log('user results: ', res.data.data);
      dispatch({type: 'LoadResult', results: res.data.data});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    featchData();
  }, [target, dispatch]);

  return (
    <View style={styles.page}>
      <View style={styles.inputContainer}>
        <Text style={styles.text}>名字：</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeTargetName}
          value={targetName}
          placeholder="目标名字"
          placeholderTextColor={'gray'}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.text}>描述：</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeDescription}
          value={description}
          placeholder="目标描述"
          placeholderTextColor={'gray'}
        />
      </View>
      <Ionicons
        style={{fontSize: 24, color: '#ffffff'}}
        name="add"
        onPress={onAddBtnPress}
      />
      <FlatList
        style={{flex: 1}}
        data={targetContext.results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.text}>阶段：</Text>
              <TextInput
                style={styles.cellInput}
                onChangeText={text =>
                  dispatch({
                    type: 'ChangeResult',
                    newResult: {
                      ...item,
                      name: text,
                    },
                  })
                }
                value={item.name}
                placeholder="阶段名称"
              />
            </View>
            <Text>|</Text>
            <View style={styles.cell}>
              <Text style={styles.text}>成果：</Text>
              <TextInput
                value={item.value}
                style={styles.cellInput}
                onChangeText={text =>
                  dispatch({
                    type: 'ChangeResult',
                    newResult: {
                      ...item,
                      value: text,
                    },
                  })
                }
              />
            </View>
          </View>
        )}
      />
      <View style={{flex: 1, alignItems: 'center'}}>
        <Pressable style={styles.okBtn} onPress={handleOKBtnPress}>
          <Text style={styles.btnText}>确定</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    color: '#ffffff',
    height: 40,
    paddingRight: 10,
    marginRight: 10,
    width: '80%',
    margin: 10,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#1E1E1E',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  cellInput: {
    flex: 1,
    color: '#ffffff',
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginLeft: 5,
    backgroundColor: '#1E1E1E',
  },
  okBtn: {
    alignItems: 'center',
    width: '80%',
    height: 50,
    marginTop: 30,
    backgroundColor: 'yellow',
    marginHorizontal: 5,
    borderRadius: 25,
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#000000',
  },
  text: {
    color: '#ffffff',
  },
});

export default AddTarget;
