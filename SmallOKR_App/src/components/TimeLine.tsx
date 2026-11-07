import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useCallback, memo } from 'react';
import dayjs from 'dayjs';
import { ThemeContext } from '../state/ThemeContext';
type DataType = {
  id: string;
  dateTime: string;
  endTime?: string;
  title: string;
};
type ItemProps = {
  item: DataType;
  color: string | undefined;
  handlePress: (item: DataType) => void;
  handleLongPress: (item: DataType) => void;
};
interface TimeLineProps {
  data: DataType[];
  handleItemPress: (data: DataType) => void;
  handleItemLongPress: (data: DataType) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  empty?: React.ReactElement;
}
const formatTime = (value?: string) =>
  value
    ? dayjs(value).isValid()
      ? dayjs(value).format('HH:mm')
      : value.slice(0, 5)
    : '';
const Item = memo(
  ({ item, color, handlePress, handleLongPress }: ItemProps) => {
    const colors = useContext(ThemeContext)?.theme.colors;
    return (
      <View style={styles.row}>
        <View style={[styles.time, { borderColor: colors?.placeholder }]}>
          <Text style={[styles.startTime, { color: colors?.text }]}>
            {formatTime(item.dateTime)}
          </Text>
          {!!item.endTime && (
            <Text style={[styles.endTime, { color: colors?.placeholder }]}>
              {formatTime(item.endTime)}
            </Text>
          )}
          <View
            style={[
              styles.dot,
              {
                backgroundColor: colors?.primary,
                borderColor: colors?.background,
              },
            ]}
          />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={item.title}
          accessibilityHint="点击编辑待办"
          onPress={() => handlePress(item)}
          onLongPress={() => handleLongPress(item)}
          style={({ pressed }) => [
            styles.card,
            { backgroundColor: color, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors?.text }]}>
              {item.title}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  },
);
const TimeLine = ({
  data,
  handleItemPress,
  handleItemLongPress,
  refreshing = false,
  onRefresh,
  empty,
}: TimeLineProps) => {
  const colors = useContext(ThemeContext)?.theme.colors;
  const color = colors?.card;
  const renderItem = useCallback(
    ({ item }: { item: DataType }) => (
      <Item
        color={color}
        item={item}
        handlePress={handleItemPress}
        handleLongPress={handleItemLongPress}
      />
    ),
    [color, handleItemPress, handleItemLongPress],
  );
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={7}
      renderItem={renderItem}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={
        empty || (
          <Text
            style={{
              color: colors?.placeholder || 'gray',
              textAlign: 'center',
              paddingTop: 40,
              fontSize: 14,
            }}
          >
            暂无待办
          </Text>
        )
      }
      contentContainerStyle={styles.list}
    />
  );
};
export { TimeLine };
const styles = StyleSheet.create({
  list: { flexGrow: 1, paddingTop: 4, paddingBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'stretch', minHeight: 104 },
  time: { width: 60, paddingRight: 14, paddingTop: 20, borderRightWidth: 1 },
  startTime: { fontSize: 14, fontWeight: '600', fontVariant: ['tabular-nums'] },
  endTime: { fontSize: 11, marginTop: 6, fontVariant: ['tabular-nums'] },
  dot: {
    position: 'absolute',
    right: -5,
    top: 24,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 2,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 18,
    marginBottom: 12,
    padding: 16,
    borderRadius: 18,
    gap: 8,
  },
  content: { flex: 1 },
  title: { fontSize: 16, lineHeight: 23, fontWeight: '600' },
  caption: { fontSize: 11, marginTop: 8 },
  more: {
    minHeight: 44,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
