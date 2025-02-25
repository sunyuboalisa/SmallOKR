import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, StatusBar, StyleSheet, Text} from 'react-native';
import {TodoService} from '../service/BusiService';
import {useRoute} from '@react-navigation/native';

type ItemProps = {
  title: string;
  selected: boolean;
  handlePress: () => void;
};

const Item = ({title, selected, handlePress}: ItemProps) => {
  const [selectedInner, setSelectedInner] = useState(selected);

  return (
    <Pressable
      style={styles.item}
      onPress={() => {
        setSelectedInner(!selectedInner);
        handlePress();
      }}>
      <Text style={styles.title}>{title}</Text>
      {selectedInner && <Text style={styles.title}>✅</Text>}
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
  const route = useRoute();
  const {todoId} = route.params;
  const [data, setData] = useState<ItemModel[]>([]);
  const fetchData = async () => {
    try {
      const repeatDicRes = await TodoService.getRepeatDicEntrys();
      const todoRepeatRes = await TodoService.getRepeat(todoId);

      const todoRepeats = todoRepeatRes.data.data;
      const resData = repeatDicRes.data.data.map(
        (item: {id: any; entryValue: any}) => {
          let entry = {
            todoRepeatId: '',
            repeatId: item.id,
            title: item.entryValue,
            selected: false,
          };

          todoRepeats.forEach(
            (element: {repeatId: any; todoRepeatId: string}) => {
              if (element.repeatId === item.id) {
                entry.todoRepeatId = element.todoRepeatId;
                entry.selected = true;
              }
            },
          );

          return entry;
        },
      );
      console.log(resData);
      setData(resData);
    } catch (error) {
      console.log(error);
    }
  };

  const addRepeat = async (todoRepeat: {
    todoRepeatId?: string;
    todoId: string;
    repeatId: string;
  }) => {
    await TodoService.addRepeat(todoRepeat);
  };
  const deleteRepeat = async (todoRepeat: {
    todoId: string;
    repeatId: string;
  }) => {
    await TodoService.deleteRepeat(todoRepeat);
  };
  const handleItemPress = (item: ItemModel) => {
    const newData = data.map(entry => {
      if (entry.repeatId === item.repeatId) {
        if (entry.selected) {
          deleteRepeat({todoId: todoId, repeatId: entry.repeatId});
        } else {
          addRepeat({todoId: todoId, repeatId: entry.repeatId});
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
    <FlatList
      data={data}
      renderItem={({item}) => (
        <Item
          title={item.title}
          selected={item.selected}
          handlePress={() => handleItemPress(item)}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#333333',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
    color: '#ffffff',
  },
});

export default RepeatPage;
