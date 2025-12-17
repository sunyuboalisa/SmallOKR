import React, { useContext } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeContext } from '../state/ThemeContext';

export type RepeatUIModel = {
  id: string;
  todoRepeatId: string;
  repeatId: string;
  title: string;
  selected: boolean;
};

interface RepeatModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (repeats: RepeatUIModel[]) => void;
  repeats: RepeatUIModel[];
}

const Item = ({
  title,
  selected,
  handlePress,
}: {
  title: string;
  selected: boolean;
  handlePress: () => void;
}) => {
  const themeContext = useContext(ThemeContext);
  const colors = themeContext?.theme.colors;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.item,
        {
          backgroundColor: colors?.card || '#f9f9f9',
          opacity: pressed ? 0.8 : 1,
        },
        selected && { backgroundColor: colors?.primary || '#007AFF' },
      ]}
      onPress={handlePress}
    >
      <Text
        style={[
          styles.title,
          { color: selected ? '#fff' : colors?.text || '#000' },
        ]}
      >
        {title}
      </Text>
      {selected && <Text style={{ color: '#fff' }}>✓</Text>}
    </Pressable>
  );
};

export const RepeatModal = ({
  isVisible,
  onClose,
  onSave,
  repeats,
}: RepeatModalProps) => {
  const themeContext = useContext(ThemeContext);
  const colors = themeContext?.theme.colors;
  const [tempRepeats, setTempRepeats] =
    React.useState<RepeatUIModel[]>(repeats);
  console.log('tempRepeats :', tempRepeats);
  console.log('repeats :', repeats);
  const toggleRepeat = (repeatItem: RepeatUIModel) => {
    if (!tempRepeats) return;
    const updatedRepeats = tempRepeats.map(r => {
      if (r.repeatId === repeatItem.repeatId) {
        const updatedItem = { ...r, selected: !r.selected };

        return updatedItem;
      }
      return r;
    });
    setTempRepeats(updatedRepeats);
  };

  React.useEffect(() => {
    if (isVisible) {
      setTempRepeats(repeats);
    }
  }, [isVisible, repeats]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalMask}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalOuterContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors?.background || '#fff' },
            ]}
          >
            <View style={styles.modalHandle} />

            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Text style={{ color: colors?.primary }}>取消</Text>
              </TouchableOpacity>
              <Text style={{ fontWeight: 'bold', color: colors?.text }}>
                重复周期
              </Text>
              <TouchableOpacity onPress={() => onSave(tempRepeats)}>
                <Text style={{ color: colors?.primary, fontWeight: 'bold' }}>
                  确定
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={tempRepeats}
              keyExtractor={item => item.repeatId}
              renderItem={({ item }) => (
                <Item
                  title={item.title}
                  selected={item.selected}
                  handlePress={() => {
                    toggleRepeat(item);
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              contentContainerStyle={{ paddingBottom: 30 }}
              style={{ maxHeight: 500 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalMask: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOuterContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    marginBottom: 15,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
  },
});

export default RepeatModal;
