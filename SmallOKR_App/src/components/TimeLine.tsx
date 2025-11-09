import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { ThemeContext } from '../state/ThemeContext';

type DataType = {
  id: string;
  dateTime: string;
  title: string;
};

type ItemProps = {
  dateTime: string;
  title: string;
  color: string | undefined;
  handlePress: () => void;
  handleLongPress: () => void;
};

interface TimeLineProps {
  data: DataType[];
  handleItemPress: (data: DataType) => void;
  handleItemLongPress: (data: DataType) => void;
}

const Item = ({
  dateTime,
  title,
  color,
  handlePress,
  handleLongPress,
}: ItemProps) => {
  const themeContext = useContext(ThemeContext);
  return (
    <Pressable
      style={styles.rowContainer}
      onPress={() => handlePress()}
      onLongPress={handleLongPress}
    >
      <View style={styles.timeContainer}>
        <Text
          style={{ ...styles.text, color: themeContext?.theme.colors.text }}
        >
          {dateTime}
        </Text>
      </View>
      <View style={styles.titleContainer}>
        <View style={{ ...styles.titleWrapper, backgroundColor: color }}>
          <Text
            style={{ ...styles.text, color: themeContext?.theme.colors.text }}
          >
            {title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const TimeLine = ({
  data,
  handleItemPress,
  handleItemLongPress,
}: TimeLineProps) => {
  const themeContext = useContext(ThemeContext);
  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => {
          return (
            <Item
              color={themeContext?.theme.colors.card}
              dateTime={item.dateTime}
              title={item.title}
              handlePress={() => handleItemPress(item)}
              handleLongPress={() => handleItemLongPress(item)}
            />
          );
        }}
      />
    </View>
  );
};

export { TimeLine };

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 80,
  },
  timeContainer: {
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  titleContainer: {
    flex: 1,
    padding: 10,
  },
  titleWrapper: {
    flex: 1,
    borderRadius: 8,
    paddingLeft: 20,
    justifyContent: 'center',
    textAlign: 'left',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  text: {
    color: '#ffffff',
  },
});
