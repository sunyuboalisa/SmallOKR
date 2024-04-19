import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {getColor} from '../theme';

type DataType = {
  dateTime: string;
  title: string;
};

type ItemProps = {
  dateTime: string;
  title: string;
  color: string;
};

interface TimeLineProps {
  data: DataType[];
}

const Item = ({dateTime, title, color}: ItemProps) => {
  return (
    <View style={styles.rowContainer}>
      <View style={styles.timeContainer}>
        <Text>{dateTime}</Text>
      </View>
      <View style={{...styles.titleContainer, backgroundColor: color}}>
        <Text>{title}</Text>
      </View>
    </View>
  );
};

const TimeLine = ({data}: TimeLineProps) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({item, index}) => {
          return (
            <Item
              color={getColor(index)}
              dateTime={item.dateTime}
              title={item.title}
            />
          );
        }}
      />
    </View>
  );
};

export {TimeLine};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1,
    alignContent: 'center',
    minHeight: 80,
  },
  timeContainer: {
    borderRightWidth: 1,
    minHeight: 50,
    justifyContent: 'center',
    width: 80,
  },
  titleContainer: {
    minHeight: 30,
    height: 60,
    width: 200,
    padding: 5,
    fontSize: 22,
    justifyContent: 'center',
    textAlign: 'left',
    borderColor: 'gray',
    borderWidth: 1,
    marginHorizontal: 8,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
