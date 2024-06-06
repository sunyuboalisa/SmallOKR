import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
interface CardProps {
  title: string;
  description: string;
  color: string;
  handlePress: () => void;
}
const Card = ({title, description, color, handlePress}: CardProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}>
      <Animated.View style={{...styles.container, backgroundColor: color}}>
        <View style={styles.circle} />
        <View style={{justifyContent: 'center', margin: 5}}>
          <Text style={styles.titleFont}>{title}</Text>
          <Text style={styles.descriptionFont}>{description}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export {Card};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    margin: 10,
  },
  circle: {
    borderWidth: 1,
    width: 80,
    height: 80,
    borderRadius: 1000, // High value
  },
  titleFont: {
    fontSize: 22,
    marginBottom: 5,
  },
  descriptionFont: {
    fontSize: 16,
  },
});
