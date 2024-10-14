import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import GalaxyGraph from './GalaxyGraph';
import {TargetService} from '../service/BusiService';
import {useFocusEffect} from '@react-navigation/native';

const Dashboard = () => {
  const [data, setData] = useState(['']);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          const res = await TargetService.getTargets();
          if (isActive) {
            const resData = res.data.data;
            const newState = resData.map(
              (value: {id: any; name: any; description: any}) => {
                let entry = value.name;
                return entry;
              },
            );
            setData(newState);
          }
        } catch (e) {
          // Handle error
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <GalaxyGraph data={data} />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
