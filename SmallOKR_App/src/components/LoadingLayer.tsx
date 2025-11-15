import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

type LoadingLayerProps = {
  visible: boolean;
  text?: string;
};

const LoadingLayer: React.FC<LoadingLayerProps> = ({
  visible,
  text = '加载中...',
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  box: {
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    marginTop: 10,
  },
});

export default LoadingLayer;
