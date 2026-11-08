import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { TextInput } from 'react-native';
import EditTarget from '../src/components/EditTarget';
import { TargetContextProvider } from '../src/state/TargetContext';

const mockGetResults = jest.fn();
const mockService = { getResults: mockGetResults };

jest.mock('react-native', () => {
  const React = require('react');
  return {
    TextInput: 'TextInput',
    Text: 'Text',
    View: 'View',
    ScrollView: 'ScrollView',
    KeyboardAvoidingView: 'KeyboardAvoidingView',
    Pressable: 'Pressable',
    Platform: { OS: 'android' },
    StyleSheet: { create: (styles: object) => styles },
    FlatList: ({ data, renderItem }: any) =>
      React.createElement(
        'FlatList',
        null,
        data.map((item: any, index: number) =>
          React.createElement(
            React.Fragment,
            { key: item.id || index },
            renderItem({ item, index }),
          ),
        ),
      ),
  };
});

jest.mock('../src/service/TargetService', () => ({
  __esModule: true,
  default: () => mockService,
}));
jest.mock('../src/state/ThemeContext', () => ({
  ThemeContext: require('react').createContext(undefined),
}));
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

test.each([200, '200'])(
  'shows existing stage results for success code %p',
  async code => {
    mockGetResults.mockResolvedValueOnce({
      data: {
        code,
        data: [
          {
            id: 'stage-1',
            targetId: 'target-1',
            name: 'Existing stage',
            value: 'Existing result',
          },
        ],
      },
    });
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(
        <TargetContextProvider>
          <EditTarget
            navigation={{} as any}
            route={
              {
                params: {
                  target: { id: 'target-1', name: 'Target', description: '' },
                },
              } as any
            }
          />
        </TargetContextProvider>,
      );
    });
    const inputValues = renderer!.root
      .findAllByType(TextInput)
      .map(input => input.props.value);
    expect(inputValues).toContain('Existing stage');
    expect(inputValues).toContain('Existing result');
    await ReactTestRenderer.act(async () => renderer!.unmount());
  },
);

test('renders prepared results immediately without refetching and keeps edits local', async () => {
  mockGetResults.mockReset();
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <TargetContextProvider>
        <EditTarget
          navigation={{} as any}
          route={
            {
              params: {
                target: {
                  id: 'prepared-target',
                  name: 'Target',
                  description: '',
                },
                initialResults: [
                  {
                    id: 'prepared-stage',
                    targetId: 'prepared-target',
                    name: 'Prepared stage',
                    value: 'Prepared value',
                  },
                ],
              },
            } as any
          }
        />
      </TargetContextProvider>,
    );
  });
  expect(mockGetResults).not.toHaveBeenCalled();
  const stageInput = renderer.root
    .findAllByType(TextInput)
    .find(input => input.props.value === 'Prepared stage');
  expect(stageInput).toBeDefined();
  await ReactTestRenderer.act(async () =>
    stageInput!.props.onChangeText('Edited stage'),
  );
  expect(
    renderer.root.findAllByType(TextInput).map(input => input.props.value),
  ).toContain('Edited stage');
  await ReactTestRenderer.act(async () => renderer.unmount());
});
