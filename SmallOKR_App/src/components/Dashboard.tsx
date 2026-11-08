import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import GalaxyGraph from './GalaxyGraph';
import useTargetService from '../service/TargetService';
import { TargetContext, TargetDispatchContext } from '../state/TargetContext';
import { useTheme } from '../state/ThemeContext';
import { MyTabScreenProps } from '../common/NativeScreenTypes';
import { useIsFocused } from '@react-navigation/native';
import { usePrepareTargetEditor } from '../hooks/usePrepareTargetEditor';

const Dashboard = ({ navigation }: MyTabScreenProps<'Dashboard'>) => {
  const isFocused = useIsFocused();
  const service = useTargetService();
  const prepareEditor = usePrepareTargetEditor();
  const { targets } = useContext(TargetContext);
  const dispatch = useContext(TargetDispatchContext);
  const { theme } = useTheme();
  const [error, setError] = useState(false);
  const load = useCallback(async () => {
    setError(false);
    try {
      const res = await service.getTargets({ showLoading: false });
      if (String(res.data.code) !== '200' || !Array.isArray(res.data.data))
        throw Error('load');
      dispatch({ type: 'Load', targets: res.data.data });
    } catch {
      setError(true);
    }
  }, [service, dispatch]);
  useEffect(() => {
    load();
  }, [load]);
  const open = useCallback(
    async (id: string) => {
      const target = targets.find(t => t.id === id);
      if (!target) return;
      const params = await prepareEditor(target);
      if (params)
        navigation.navigate('TargetTab', { screen: 'EditTarget', params });
    },
    [targets, navigation, prepareEditor],
  );
  const data = useMemo(
    () => targets.map(({ id, name }) => ({ id, name })),
    [targets],
  );
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <GalaxyGraph data={data} active={isFocused} onNodeDoublePress={open} />
      {error && (
        <Pressable
          accessibilityRole="button"
          onPress={load}
          style={[styles.error, { backgroundColor: theme.colors.card }]}
        >
          <Text style={{ color: theme.colors.text, fontSize: 13 }}>
            加载失败，点击重试
          </Text>
        </Pressable>
      )}
    </View>
  );
};
export default Dashboard;
const styles = StyleSheet.create({
  container: { flex: 1 },
  error: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
