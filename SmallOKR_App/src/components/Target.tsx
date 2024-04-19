import {SafeAreaView, StyleSheet} from 'react-native';
import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {TargetContext} from '../state/TargetContext';
import {Card} from './Card';
import {getColor} from '../theme';

const TargetHeaderRight = () => {
  const navigation =
    useNavigation<NavigationProp<MyReactNavigation.ParamList>>();

  const onAddBtnPress = () => {
    navigation.navigate('AddTarget');
  };
  return <Ionicons name="add" style={styles.addBtn} onPress={onAddBtnPress} />;
};

const Target = function () {
  const targetContext = useContext(TargetContext);
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
            />
          );
        }}
        data={targetContext}
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
