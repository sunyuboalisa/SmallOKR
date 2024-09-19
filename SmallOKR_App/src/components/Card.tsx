import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
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
      <View style={styles.circle} />
      <View style={{justifyContent: 'center', margin: 5, paddingLeft: 10}}>
        <Text style={styles.titleFont}>{title}</Text>
        <Text style={styles.descriptionFont}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export {Card};

const styles = StyleSheet.create({
  container: {
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
    borderRadius: 1000, // High value
    borderWidth: 1,
    borderColor: 'rgba(ee, ee, ee,0.3)',
  },
  titleFont: {
    fontSize: 22,
    marginBottom: 5,
  },
  descriptionFont: {
    fontSize: 16,
  },
});
