import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
interface CardProps {
  title: string;
  description: string;
  color: string;
  handlePress: () => void;
  handleLongPress: () => void;
}
const Card = ({
  title,
  description,
  color,
  handlePress,
  handleLongPress,
}: CardProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        handlePress();
      }}
      onLongPress={() => {
        handleLongPress();
      }}
      delayLongPress={500}
      style={{...styles.container, backgroundColor: color}}>
      <View style={styles.circle}>
        <Icon name="flag" color={'#ffffff'} size={28} />
      </View>
      <View style={{justifyContent: 'center', margin: 1, paddingLeft: 10}}>
        <Text style={styles.titleFont}>{title}</Text>
        <Text style={styles.descriptionFont}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export {Card};

const styles = StyleSheet.create({
  container: {
    marginBottom: 1,
    flexDirection: 'row',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: 'rgba(ee, ee, ee,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleFont: {
    fontSize: 22,
    marginBottom: 5,
    color: '#ffffff',
  },
  descriptionFont: {
    fontSize: 16,
    color: '#ffffff',
  },
});
