import {SafeAreaView, StyleSheet} from 'react-native';
import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
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

const Target = function () {
  const targetContext = useContext(TargetContext);
  const dispatch = useContext(TargetDispatchContext);
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();

  const handlePress = (target: ITarget) => {
    console.log('选择目标', target);
    navigation.navigate('AddTarget', {target: target});
  };
  useFocusEffect(
    React.useCallback(() => {
      TargetService.getTargets()
        .then(res => {
          console.log('user targets:', res.data.data);
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
    }, [dispatch]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        keyExtractor={(item, index) => item.name + index}
        renderItem={({item, index}) => {
          return (
            <Card
              color={getColor(index)}
              description={item.description}
              title={item.name}
              handlePress={() => handlePress(item)}
            />
          );
        }}
        data={targetContext.targets}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  header: {
    fontSize: 32,
    backgroundColor: 'gold',
    margin: 1,
  },
  item: {
    backgroundColor: '#4682B4',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
  },
  addBtn: {
    fontSize: 25,
    color: '#00cc00',
    textAlign: 'center',
  },
});

export {TargetHeaderRight, Target};
