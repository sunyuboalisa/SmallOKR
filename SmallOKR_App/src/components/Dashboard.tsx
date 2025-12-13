import { StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import GalaxyGraph from './GalaxyGraph';
import useTargetService from '../service/TargetService';
import { TargetContext, TargetDispatchContext } from '../state/TargetContext';
import { useTheme } from '../state/ThemeContext';

const Dashboard = () => {
  const targetService = useTargetService();
  const [data, setData] = useState(['']);
  const targetContext = useContext(TargetContext);
  const dispatch = useContext(TargetDispatchContext);
  const theme = useTheme();
  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const res = await targetService.getTargets();
        let tempData = res.data.data;
        const newState = tempData.map(
          (value: { id: any; name: any; description: any }) => ({
            id: value.id,
            name: value.name,
            description: value.description,
          }),
        );
        dispatch({ type: 'Load', targets: newState });
      } catch (e) {
        console.log('targets error：', e);
      }
    };

    fetchTargets();
  }, [dispatch, targetService]);

  useEffect(() => {
    const resData = targetContext.targets;
    const newState = resData.map(
      (value: { id: any; name: any; description: any }) => {
        let entry = value.name;
        return entry;
      },
    );
    setData(newState);
  }, [targetContext]);

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: theme.theme.colors.background,
      }}
    >
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
