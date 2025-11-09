import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import useTodoService from '../service/TodoService';
import { useRoute } from '@react-navigation/native';
import { ThemeContext } from '../state/ThemeContext';
import { useContext } from 'react';

type ItemProps = {
  title: string;
  selected: boolean;
  handlePress: () => void;
};

const Item = ({ title, selected, handlePress }: ItemProps) => {
  const themeContext = useContext(ThemeContext);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.item,
        {
          backgroundColor: themeContext?.theme.colors.card,
          opacity: pressed ? 0.8 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        selected && {
          backgroundColor: themeContext?.theme.colors.primary,
        },
      ]}
      onPress={handlePress}
      android_ripple={{ color: themeContext?.theme.colors.ripple }}
    >
      <Text
        style={[
          styles.title,
          { color: themeContext?.theme.colors.text },
          selected && styles.selectedText,
        ]}
      >
        {title}
      </Text>
      {selected && (
        <View style={styles.checkmarkContainer}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      )}
    </Pressable>
  );
};

type ItemModel = {
  todoRepeatId: string;
  repeatId: string;
  title: string;
  selected: boolean;
};

export const RepeatPage = () => {
  const todoService = useTodoService();
  const route = useRoute();
  const { todoId } = route.params;
  const [data, setData] = useState<ItemModel[]>([]);
  const themeContext = useContext(ThemeContext);

  const fetchData = async () => {
    try {
      const repeatDicRes = await todoService.getRepeatDicEntrys();
      const todoRepeatRes = await todoService.getRepeat(todoId);

      const todoRepeats = todoRepeatRes.data.data;
      const resData = repeatDicRes.data.data.map(
        (item: { id: any; entryValue: any }) => {
          let entry = {
            todoRepeatId: '',
            repeatId: item.id,
            title: item.entryValue,
            selected: false,
          };

          todoRepeats.forEach(
            (element: { repeatId: any; todoRepeatId: string }) => {
              if (element.repeatId === item.id) {
                entry.todoRepeatId = element.todoRepeatId;
                entry.selected = true;
              }
            },
          );

          return entry;
        },
      );
      setData(resData);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data. Please try again later.');
      console.error(error);
    }
  };

  const addRepeat = async (todoRepeat: {
    todoRepeatId?: string;
    todoId: string;
    repeatId: string;
  }) => {
    try {
      await todoService.addRepeat(todoRepeat);
    } catch (error) {
      Alert.alert('Error', 'Failed to add repeat. Please try again.');
      console.error(error);
    }
  };

  const deleteRepeat = async (todoRepeat: {
    todoId: string;
    repeatId: string;
  }) => {
    try {
      await todoService.deleteRepeat(todoRepeat);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete repeat. Please try again.');
      console.error(error);
    }
  };

  const handleItemPress = (item: ItemModel) => {
    const newData = data.map(entry => {
      if (entry.repeatId === item.repeatId) {
        if (entry.selected) {
          deleteRepeat({ todoId: todoId, repeatId: entry.repeatId });
        } else {
          addRepeat({ todoId: todoId, repeatId: entry.repeatId });
        }
        entry.selected = !entry.selected;
      }
      return entry;
    });

    setData(newData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: themeContext?.theme.colors.background },
      ]}
    >
      <FlatList
        data={data}
        keyExtractor={item => item.repeatId}
        renderItem={({ item }) => (
          <Item
            title={item.title}
            selected={item.selected}
            handlePress={() => handleItemPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  listContent: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  title: {
    fontSize: 16,
    flex: 1,
  },
  selectedText: {
    fontWeight: '600',
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  separator: {
    height: 8,
  },
});

export default RepeatPage;
