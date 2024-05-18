import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {TargetService} from '../service/BusiService';

const AddTarget = () => {
  const navigation = useNavigation();
  const handleOKBtnPress = () => {
    TargetService.addTarget({
      name: targetName,
      description: description
    })
      .then(res => {
        navigation.goBack();
      })
      .catch();
  };

  const [description, onChangeDescription] = useState('');
  const [targetName, onChangeTargetName] = useState('');

  const results = [{name: '阶段1', value: '100'}];

  return (
    <View>
      <Text>Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeTargetName}
        value={targetName}
        placeholder="Please input the target name"
      />
      <Text>Description</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeDescription}
        value={description}
        placeholder="Please input the target description"
      />
      <FlatList
        data={results}
        renderItem={({item}) => (
          <View>
            <TextInput>{item.name}</TextInput>
            <TextInput>{item.value}</TextInput>
          </View>
        )}
      />
      <Button title="OK" onPress={handleOKBtnPress} />
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
});

export default AddTarget;
