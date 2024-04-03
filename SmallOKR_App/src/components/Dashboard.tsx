import {StyleSheet} from 'react-native';
import React from 'react';
import GalaxyGraph from './GalaxyGraph';
import {SafeAreaView} from 'react-native-safe-area-context';

const Dashboard = () => {
  return (
    <SafeAreaView style={styles.container} >
      <GalaxyGraph />
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
