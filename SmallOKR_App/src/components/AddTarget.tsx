import {
  Button,
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

  const handleOKBtnPress =async () => {
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
      try {
        const addResultRes=await TargetService.addResult(targetContext.results);
      } catch (error) {
        console.log(error);
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
  };

  const featchData=async ()=>{
    try {
      const res=await TargetService.getResults({targetId:target.id});
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
        <Text>名字：</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeTargetName}
          value={targetName}
          placeholder="目标名字"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>描述：</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeDescription}
          value={description}
          placeholder="目标描述"
        />
      </View>
      <Ionicons style={{fontSize:24}} name="add" onPress={onAddBtnPress} />
      <FlatList
        style={{flex:1}}
        data={targetContext.results}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({item}) => (
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text>阶段：</Text>
              <TextInput style={styles.cellInput}>{item.name}</TextInput>
            </View>
            <Text>|</Text>
            <View style={styles.cell}>
              <Text>成果：</Text>
              <TextInput style={styles.cellInput}>{item.value}</TextInput>
            </View>
          </View>
        )}
      />
      <View style={{flex:1,alignItems:'center'}}>
        <Pressable style={styles.okBtn} onPress={handleOKBtnPress}>
          <Text style={styles.btnText}>确定</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex:1,
    flexDirection: 'column',
    backgroundColor:'white',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    margin:5,
    flexDirection: 'row',
    alignItems:'center'
  },
  input: {
    height: 40,
    paddingRight:10,
    marginRight:10,
    width:'80%',
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderColor:'gray',
  },
  row: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cell: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    margin:10
  },
  cellInput: {
    flex:1,
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginLeft:5,
    borderColor:'gray',
  },
  okBtn:{
    alignItems:'center',
    width: '80%',
    height:50,
    marginTop:30,
    backgroundColor: '#007eff',
    marginHorizontal: 5,
    borderRadius:25,
    justifyContent:'center'
  },
  btnText: {
    fontSize: 24,
    textAlign: 'center',
    color:'white'
  },
});

export default AddTarget;
