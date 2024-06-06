import {StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import GalaxyGraph from './GalaxyGraph';
import {TargetContext, TargetDispatchContext} from '../state/TargetContext';
import {TargetService} from '../service/BusiService';

const Dashboard = () => {
  const targetContext = useContext(TargetContext);
  const dispatch = useContext(TargetDispatchContext);
  const [data, setData] = useState(['']);
  useEffect(() => {
    TargetService.getTargets()
      .then(res => {
        const resData = res.data.data;
        const newState = resData.map(
          (value: {id: any; name: any; description: any}) => {
            let entry = value.name;
            return entry;
          },
        );
        setData(newState);
        console.log('面板数据：', newState);
      })
      .catch(e => console.log('targets error：', e));
  }, [dispatch, targetContext.targets]);

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
    backgroundColor: 'white',
  },
});
