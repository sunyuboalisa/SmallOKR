import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
interface CardProps {
  title: string;
  description: string;
  color: string;
}
const Card = ({title, description, color}: CardProps) => {
  return (
    <View style={{...styles.container, backgroundColor: color}}>
      <View style={styles.circle} />
      <View style={{justifyContent: 'center', margin: 5}}>
        <Text style={styles.titleFont}>{title}</Text>
        <Text style={styles.descriptionFont}>{description}</Text>
      </View>
    </View>
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
