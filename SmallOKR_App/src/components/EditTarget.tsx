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
import React, { useContext, useEffect, useState, useRef } from 'react';
import useTargetService from '../service/TargetService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TargetDispatchContext } from '../state/TargetContext';
import { ThemeContext } from '../state/ThemeContext';
import { MyStackScreenProps } from '../common/NativeScreenTypes';
import { IResult } from '../model/OKRModel';

const EditTarget = ({
  navigation,
  route,
}: MyStackScreenProps<'EditTarget'>) => {
  const { target, initialResults } = route.params;

  const targetService = useTargetService();
  const [description, onChangeDescription] = useState(target.description);
  const [targetName, onChangeTargetName] = useState(target.name);
  const [results, setResults] = useState<IResult[]>(initialResults ?? []);
  const dispatch = useContext(TargetDispatchContext);
  const themeContext = useContext(ThemeContext);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [showError, setShowError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const savingRef = useRef(false);

  const onAddBtnPress = () => {
    setResults(current => [
      ...current,
      {
        id: '',
        targetId: target.id,
        name: '',
        value: '',
        creTime: new Date(),
      },
    ]);
  };

  const handleOKBtnPress = async () => {
    if (savingRef.current) return;
    setSaveError('');
    if (targetName.trim() === '') {
      setShowError(true);
      setSaveError('请填写目标名称');
      return;
    }
    savingRef.current = true;
    setSaving(true);
    try {
      const addTargetRes = await targetService.saveTarget({
        name: targetName,
        description: description,
        id: target.id,
        status: 0,
      });
      const addResultRes = await targetService.saveResult(results);
      const getTargetsRes = await targetService.getTargets();
      let data = getTargetsRes.data.data;

      const newState = data.map(
        (value: { id: any; name: any; description: any }) => ({
          id: value.id,
          name: value.name,
          description: value.description,
        }),
      );

      if (String(addTargetRes.data.code) !== '200') {
        throw new Error('保存目标失败');
      }
      if (String(addResultRes.data.code) !== '200') {
        throw new Error('保存阶段成果失败');
      }
      dispatch({ type: 'Load', targets: newState });
      navigation.goBack();
    } catch (error) {
      console.error(error);
      setSaveError('保存失败，请重试，输入内容已保留');
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const handleLongPress = () => {
    setShowDeleteIcon(!showDeleteIcon);
  };
  const handleDeleteResult = async (item: IResult, index: number) => {
    if (item.id === '') {
      setResults(current =>
        current.filter((_, resultIndex) => resultIndex !== index),
      );
      return;
    }
    const res = await targetService.deleteResult(item.id);
    if (String(res.data.code) === '200') {
      setResults(current => current.filter(result => result.id !== item.id));
    } else {
      throw new Error('删除阶段成果失败');
    }
  };
  useEffect(() => {
    let active = true;
    onChangeDescription(target.description);
    onChangeTargetName(target.name);
    setResults(initialResults ?? []);
    setSaveError('');
    const featchData = async () => {
      try {
        // 新的目标，id 为空，不请求阶段成果
        if (initialResults !== undefined || target.id === '') {
          return;
        }
        const res = await targetService.getResults({ targetId: target.id });
        if (!active) return;
        if (String(res.data.code) === '200') {
          setResults(res.data.data);
        } else {
          throw new Error('获取阶段成果失败');
        }
      } catch (error) {
        console.error(error);
      }
    };
    featchData();

    return () => {
      active = false;
    };
  }, [
    target.id,
    target.name,
    target.description,
    initialResults,
    targetService,
  ]);

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: themeContext?.theme.colors.background },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.page}>
          {/* Input Section */}
          <View
            style={[
              styles.card,
              { backgroundColor: themeContext?.theme.colors.card },
            ]}
          >
            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: themeContext?.theme.colors.text },
                ]}
              >
                目标名称
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: showError
                      ? themeContext?.theme.colors.error
                      : themeContext?.theme.colors.border,
                    color: themeContext?.theme.colors.text,
                    backgroundColor: themeContext?.theme.colors.background,
                  },
                ]}
                onChangeText={text => {
                  onChangeTargetName(text);
                  if (text.trim() === '') {
                    setShowError(true);
                  } else {
                    setShowError(false);
                  }
                }}
                value={targetName}
                placeholder="请输入目标名称"
                placeholderTextColor={themeContext?.theme.colors.text}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  { color: themeContext?.theme.colors.text },
                ]}
              >
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
                  { color: themeContext?.theme.colors.text },
                ]}
              >
                阶段成果
              </Text>
              <Pressable
                style={styles.addButton}
                onPress={onAddBtnPress}
                hitSlop={10}
              >
                <Ionicons
                  name="add-circle"
                  size={28}
                  color={themeContext?.theme.colors.primary}
                />
              </Pressable>
            </View>

            <FlatList
              scrollEnabled={false}
              data={results}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <Pressable
                  onLongPress={handleLongPress}
                  style={[
                    styles.resultCard,
                    {
                      borderColor: themeContext?.theme.colors.border,
                      backgroundColor: themeContext?.theme.colors.card,
                    },
                  ]}
                >
                  <View style={styles.resultInputGroup}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={[
                          styles.resultLabel,
                          {
                            color: themeContext?.theme.colors.text,
                          },
                        ]}
                      >
                        阶段名称
                      </Text>
                      <Ionicons
                        name="close"
                        size={24}
                        color={themeContext?.theme.colors.primary}
                        onPress={async () => {
                          handleDeleteResult(item, index);
                        }}
                        style={[
                          { paddingBottom: 10 }, // 保持原有样式
                          // 当 showDeleteIcon 为 false 时，应用隐藏样式
                          !showDeleteIcon && {
                            opacity: 0,
                            pointerEvents: 'none', // 禁用点击，防止误触
                          },
                        ]}
                      />
                    </View>
                    <TextInput
                      style={[
                        styles.resultInput,
                        {
                          borderBottomColor: themeContext?.theme.colors.border,
                          borderColor: themeContext?.theme.colors.border,
                          color: themeContext?.theme.colors.text,
                          backgroundColor:
                            themeContext?.theme.colors.background,
                        },
                      ]}
                      onChangeText={text =>
                        setResults(current =>
                          current.map((result, resultIndex) =>
                            resultIndex === index
                              ? { ...result, name: text }
                              : result,
                          ),
                        )
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
                        { color: themeContext?.theme.colors.text },
                      ]}
                    >
                      阶段成果
                    </Text>
                    <TextInput
                      value={item.value}
                      style={[
                        styles.resultInput,
                        {
                          borderBottomColor: themeContext?.theme.colors.border,
                          borderColor: themeContext?.theme.colors.border,
                          color: themeContext?.theme.colors.text,
                          backgroundColor:
                            themeContext?.theme.colors.background,
                        },
                      ]}
                      onChangeText={text =>
                        setResults(current =>
                          current.map((result, resultIndex) =>
                            resultIndex === index
                              ? { ...result, value: text }
                              : result,
                          ),
                        )
                      }
                      placeholder="具体成果"
                      placeholderTextColor={themeContext?.theme.colors.text}
                    />
                  </View>
                </Pressable>
              )}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonGroup}>
            {!!saveError && (
              <Text
                accessibilityLiveRegion="polite"
                style={{
                  color: themeContext?.theme.colors.error,
                  fontSize: 13,
                  marginBottom: 12,
                }}
              >
                {saveError}
              </Text>
            )}
            <Pressable
              style={[
                styles.primaryButton,
                {
                  backgroundColor: themeContext?.theme.colors.primary,
                },
              ]}
              onPress={handleOKBtnPress}
              disabled={saving}
              accessibilityRole="button"
              accessibilityState={{ disabled: saving }}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: themeContext?.theme.dark ? '#1C1C1E' : '#fff' },
                ]}
              >
                {saving ? '保存中…' : '保存目标'}
              </Text>
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 4 },
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
