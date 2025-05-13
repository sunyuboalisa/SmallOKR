import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {TargetService} from '../service/BusiService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TargetContext, TargetDispatchContext} from '../state/TargetContext';
import {ThemeContext} from '../state/ThemeContext';

const EditTarget = () => {
  const route = useRoute();
  const {target} = route.params;
  const navigation = useNavigation();
  const [description, onChangeDescription] = useState(target.description);
  const [targetName, onChangeTargetName] = useState(target.name);
  const targetContext = useContext(TargetContext);
  const dispatch = useContext(TargetDispatchContext);
  const themeContext = useContext(ThemeContext);

  const onAddBtnPress = () => {
    dispatch({
      type: 'AddResult',
      newResult: {
        id: '',
        targetId: target.id,
        name: '',
        value: '',
        creTime: new Date(),
      },
    });
  };

  const handleOKBtnPress = async () => {
    try {
      const addTargetRes = await TargetService.saveTarget({
        name: targetName,
        description: description,
        id: target.id,
        status: '0',
      });
      const addResultRes = await TargetService.saveResult(
        targetContext.results,
      );
      const getTargetsRes = await TargetService.getTargets();
      let data = getTargetsRes.data.data;
      const newState = data.map(
        (value: {id: any; name: any; description: any}) => {
          let entry = {
            id: value.id,
            name: value.name,
            description: value.description,
          };
          return entry;
        },
      );
      dispatch({type: 'Load', targets: newState});
      dispatch({type: 'Reload', reload: true});
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const featchData = async () => {
    try {
      const res = await TargetService.getResults({targetId: target.id});
      dispatch({type: 'LoadResult', results: res.data.data});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    featchData();
  }, [target, dispatch]);

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        {backgroundColor: themeContext?.theme.colors.background},
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.page}>
          {/* Input Section */}
          <View
            style={[
              styles.card,
              {backgroundColor: themeContext?.theme.colors.card},
            ]}>
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  {color: themeContext?.theme.colors.text},
                ]}>
                目标名称
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: themeContext?.theme.colors.border,
                    color: themeContext?.theme.colors.text,
                    backgroundColor: themeContext?.theme.colors.background,
                  },
                ]}
                onChangeText={onChangeTargetName}
                value={targetName}
                placeholder="请输入目标名称"
                placeholderTextColor={themeContext?.theme.colors.text}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  {color: themeContext?.theme.colors.text},
                ]}>
                目标描述
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.multilineInput,
                  {
                    borderColor: themeContext?.theme.colors.border,
                    color: themeContext?.theme.colors.text,
                    backgroundColor: themeContext?.theme.colors.background,
                  },
                ]}
                onChangeText={onChangeDescription}
                value={description}
                placeholder="请输入详细描述"
                placeholderTextColor={themeContext?.theme.colors.text}
                multiline
              />
            </View>
          </View>

          {/* Results List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  {color: themeContext?.theme.colors.text},
                ]}>
                阶段成果
              </Text>
              <Pressable
                style={styles.addButton}
                onPress={onAddBtnPress}
                hitSlop={10}>
                <Ionicons
                  name="add-circle"
                  size={28}
                  color={themeContext?.theme.colors.primary}
                />
              </Pressable>
            </View>

            <FlatList
              scrollEnabled={false}
              data={targetContext.results}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View
                  style={[
                    styles.resultCard,
                    {
                      borderColor: themeContext?.theme.colors.border,
                      backgroundColor: themeContext?.theme.colors.card,
                    },
                  ]}>
                  <View style={styles.resultInputGroup}>
                    <Text
                      style={[
                        styles.resultLabel,
                        {color: themeContext?.theme.colors.text},
                      ]}>
                      阶段名称
                    </Text>
                    <TextInput
                      style={[
                        styles.resultInput,
                        {
                          borderBottomColor: themeContext?.theme.colors.border,
                          color: themeContext?.theme.colors.text,
                        },
                      ]}
                      onChangeText={text =>
                        dispatch({
                          type: 'ChangeResult',
                          newResult: {
                            ...item,
                            name: text,
                          },
                        })
                      }
                      value={item.name}
                      placeholder="阶段名称"
                      placeholderTextColor={themeContext?.theme.colors.text}
                    />
                  </View>

                  <View style={styles.resultInputGroup}>
                    <Text
                      style={[
                        styles.resultLabel,
                        {color: themeContext?.theme.colors.text},
                      ]}>
                      阶段成果
                    </Text>
                    <TextInput
                      value={item.value}
                      style={[
                        styles.resultInput,
                        {
                          borderBottomColor: themeContext?.theme.colors.border,
                          color: themeContext?.theme.colors.text,
                        },
                      ]}
                      onChangeText={text =>
                        dispatch({
                          type: 'ChangeResult',
                          newResult: {
                            ...item,
                            value: text,
                          },
                        })
                      }
                      placeholder="具体成果"
                      placeholderTextColor={themeContext?.theme.colors.text}
                    />
                  </View>
                </View>
              )}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            <Pressable
              style={[
                styles.primaryButton,
                {
                  backgroundColor: themeContext?.theme.colors.primary,
                },
              ]}
              onPress={handleOKBtnPress}>
              <Text style={styles.buttonText}>保存目标</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  page: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  resultCard: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  resultInputGroup: {
    marginBottom: 16,
  },
  resultLabel: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  resultInput: {
    height: 42,
    borderBottomWidth: 1,
    fontSize: 15,
    paddingVertical: 8,
  },
  addButton: {
    padding: 4,
  },
  buttonGroup: {
    marginTop: 24,
  },
  primaryButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditTarget;
