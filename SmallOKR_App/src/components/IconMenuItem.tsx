import React, {useContext} from 'react';
import {Pressable, StyleSheet, Text, View, ViewStyle} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ThemeContext} from '../state/ThemeContext';

type IconType = React.ComponentProps<typeof Ionicons>['name'] | 'theme';

interface IconMenuItemProps {
  title: string;
  onPress?: () => void;
  icon?: IconType;
  iconSize?: number;
  iconColor?: string;
  isLastItem?: boolean;
  showChevron?: boolean;
  containerStyle?: ViewStyle;
}

const IconMenuItem: React.FC<IconMenuItemProps> = ({
  title,
  onPress,
  icon,
  iconSize = 20,
  iconColor,
  isLastItem = false,
  showChevron = true,
  containerStyle,
}) => {
  const themeContext = useContext(ThemeContext);
  const colors = themeContext?.theme.colors;

  const renderIcon = () => {
    if (!icon) return null;

    if (icon === 'theme') {
      return (
        <Ionicons
          name={themeContext?.theme.dark ? 'moon-outline' : 'sunny-outline'}
          size={iconSize}
          color={iconColor || colors?.text}
          style={styles.icon}
        />
      );
    }

    return (
      <Ionicons
        name={icon}
        size={iconSize}
        color={iconColor || colors?.text}
        style={styles.icon}
      />
    );
  };

  return (
    <Pressable
      style={({pressed}) => [
        styles.container,
        {
          backgroundColor: colors?.background,
          borderBottomWidth: isLastItem ? 0 : StyleSheet.hairlineWidth,
          borderColor: colors?.border,
        },
        containerStyle,
      ]}
      onPress={onPress}>
      <View style={styles.content}>
        {renderIcon()}
        <Text style={[styles.text, {color: colors?.text}]}>{title}</Text>
      </View>

      {showChevron && (
        <Ionicons
          name="chevron-forward-outline"
          size={18}
          color={colors?.text}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 16,
  },
  text: {
    fontSize: 16,
    flexShrink: 1,
  },
});

export default IconMenuItem;
