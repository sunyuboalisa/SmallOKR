import {
  Button,
  FlatList,
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

  const handleOKBtnPress = () => {
    TargetService.addTarget({
      name: targetName,
      description: description,
      id: target.id,
    })
      .then(() => {
        dispatch({type: 'Reload', reload: true});
        navigation.goBack();
      })
      .catch();
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
  };

  useEffect(() => {
    TargetService.getResults({
      targetId: target.id,
    })
      .then(res => {
        console.log('user results: ', res.data.data);
        dispatch({type: 'LoadResult', results: res.data.data});
      })
      .catch(err => console.log(err));
  }, [target, dispatch]);

  return (
    <View>
      <Text>名字：</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeTargetName}
        value={targetName}
        placeholder="Please input the target name"
      />
      <Text>描述：</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeDescription}
        value={description}
        placeholder="Please input the target description"
      />
      <Ionicons name="add" onPress={onAddBtnPress} />
      <FlatList
        data={targetContext.results}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({item}) => (
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text>阶段：</Text>
              <TextInput style={styles.input}>{item.name}</TextInput>
            </View>
            <View style={styles.cell}>
              <Text>阶段成果：</Text>
              <TextInput style={styles.input}>{item.value}</TextInput>
            </View>
          </View>
        )}
      />
      <Button title="OK" onPress={handleOKBtnPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    flexDirection: 'column',
  },
  cell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});

export default AddTarget;
