import React from 'react';
import {StyleSheet, View} from 'react-native';

const BackgroundImage = ({children}: {children: React.ReactNode}) => {
  return <View style={styles.background}>{children}</View>;
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#121212',
  },
});

export default BackgroundImage;
