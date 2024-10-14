import React from 'react';
import {ImageBackground, StyleSheet} from 'react-native';

const BackgroundImage = ({children}: {children: React.ReactNode}) => {
  return (
    <ImageBackground
      source={require('../../assets/imgs/background.png')}
      style={styles.background}>
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});

export default BackgroundImage;
