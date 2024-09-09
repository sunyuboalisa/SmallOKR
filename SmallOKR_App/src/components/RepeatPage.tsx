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
      {selectedInner && <Text style={styles.title}>选择</Text>}
    </Pressable>
  );
};

type ItemModel = {
  id: string;
  title: string;
  selected: boolean;
};

export const RepeatPage = () => {
  const route = useRoute();
  const {todoId} = route.params;
  const [data, setData] = useState<ItemModel[]>([]);
  const fetchData = async () => {
    try {
      const res = await TodoService.getRepeatDicEntrys();
      const todoRepeatRes = await TodoService.getRepeat(todoId);
      const todoRepeats = todoRepeatRes.data.data;
      const data = res.data.data.map(item => {
        let entry = {
          id: item.id,
          title: item.entryValue,
          selected: todoRepeats.some(i => i.id == item.id),
        };
        return entry;
      });
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addRepeat = async (todoRepeat: {todoId: string; repeatId: string}) => {
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
      if (entry.id == item.id) {
        if (entry.selected) {
          deleteRepeat({todoId: todoId, repeatId: entry.id});
        } else {
          addRepeat({todoId: todoId, repeatId: entry.id});
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
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default RepeatPage;
