import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React, { useContext } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { ThemeContext } from '../state/ThemeContext';
interface CardProps {
  title: string;
  description: string;
  color: string | undefined;
  handlePress: () => void;
  handleLongPress: () => void;
}
const Card = ({
  title,
  description,
  color,
  handlePress,
  handleLongPress,
}: CardProps) => {
  const themeContext = useContext(ThemeContext);
  const { fontScale } = useWindowDimensions();
  return (
    <TouchableOpacity
      onPress={() => {
        handlePress();
      }}
      onLongPress={() => {
        handleLongPress();
      }}
      delayLongPress={500}
      style={[
        styles.container,
        {
          backgroundColor: color,
          height: Math.max(104, Math.ceil(64 * fontScale + 28)),
        },
      ]}
    >
      <View style={styles.circle}>
        <Icon name="flag" color={themeContext?.theme.colors.text} size={28} />
      </View>
      <View
        style={{
          flex: 1,
          minWidth: 0,
          justifyContent: 'center',
          margin: 1,
          paddingLeft: 12,
        }}
      >
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            ...styles.titleFont,
            height: 24 * fontScale,
            color: themeContext?.theme.colors.text,
          }}
        >
          {title}
        </Text>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            ...styles.descriptionFont,
            height: 40 * fontScale,
            color: themeContext?.theme.colors.text,
          }}
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export { Card };

const styles = StyleSheet.create({
  container: {
    marginBottom: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  circle: {
    width: 56,
    height: 56,
    flexShrink: 0,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleFont: {
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 5,
    color: '#ffffff',
  },
  descriptionFont: {
    fontSize: 14,
    lineHeight: 20,
    color: '#ffffff',
  },
});
