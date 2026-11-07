import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import GalaxyGraph from '../src/components/GalaxyGraph';

const mockLoops: { start: jest.Mock; stop: jest.Mock }[] = [];
const mockPositions: { value: { x: number; y: number } }[] = [];
let mockAppStateChange: (state: string) => void;

jest.mock('../src/state/ThemeContext', () => ({
  ThemeContext: require('react').createContext(undefined),
}));
jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Circle: 'Circle',
  Defs: 'Defs',
  RadialGradient: 'RadialGradient',
  Stop: 'Stop',
}));
jest.mock('react-native', () => {
  class Value {
    value: any;
    constructor(value: any) {
      this.value = value;
    }
    setValue(value: any) {
      this.value = value;
    }
    stopAnimation(callback?: (value: any) => void) {
      callback?.(this.value);
    }
  }
  class ValueXY extends Value {
    constructor(value = { x: 0, y: 0 }) {
      super(value);
      mockPositions.push(this);
    }
    getTranslateTransform() {
      return [{ translateX: this.value.x }, { translateY: this.value.y }];
    }
  }
  return {
    View: 'View',
    Text: 'Text',
    useWindowDimensions: () => ({ width: 400, height: 700 }),
    StyleSheet: { create: (styles: object) => styles, absoluteFill: {} },
    Easing: { sin: () => 0, inOut: (easing: any) => easing },
    PanResponder: { create: (handlers: any) => ({ panHandlers: handlers }) },
    AppState: {
      currentState: 'active',
      addEventListener: (_: string, listener: typeof mockAppStateChange) => {
        mockAppStateChange = listener;
        return { remove: jest.fn() };
      },
    },
    Animated: {
      View: 'AnimatedView',
      Value,
      ValueXY,
      timing: jest.fn(() => ({})),
      sequence: jest.fn(() => ({})),
      spring: () => ({ start: jest.fn() }),
      loop: () => {
        const animation = { start: jest.fn(), stop: jest.fn() };
        mockLoops.push(animation);
        return animation;
      },
    },
  };
});

const data = [
  { id: 'one', name: 'First target' },
  { id: 'two', name: 'Second target' },
];
let renderer: ReactTestRenderer.ReactTestRenderer;
beforeEach(() => {
  mockLoops.length = 0;
  mockPositions.length = 0;
});
afterEach(async () => {
  await ReactTestRenderer.act(async () => renderer.unmount());
  jest.restoreAllMocks();
});

test('pauses every animation when leaving the page or backgrounding the app', async () => {
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<GalaxyGraph data={data} />);
  });
  const running = [...mockLoops];
  expect(running).toHaveLength(3);
  await ReactTestRenderer.act(async () =>
    renderer.update(<GalaxyGraph data={data} active={false} />),
  );
  running.forEach(animation => expect(animation.stop).toHaveBeenCalledTimes(1));
  await ReactTestRenderer.act(async () =>
    renderer.update(<GalaxyGraph data={data} active />),
  );
  const resumed = mockLoops.slice(3);
  await ReactTestRenderer.act(async () => mockAppStateChange('background'));
  resumed.forEach(animation => expect(animation.stop).toHaveBeenCalledTimes(1));
});

test('dragging uses total gesture displacement once and stays inside the canvas', async () => {
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<GalaxyGraph data={data} />);
  });
  const node = renderer.root
    .findAllByType('AnimatedView' as any)
    .find(view => view.props.onPanResponderGrant)!;
  const position = mockPositions[0];
  const startX = position.value.x;
  await ReactTestRenderer.act(async () => node.props.onPanResponderGrant());
  await ReactTestRenderer.act(async () =>
    node.props.onPanResponderMove(null, { dx: 10, dy: 0 }),
  );
  await ReactTestRenderer.act(async () =>
    node.props.onPanResponderMove(null, { dx: 20, dy: 0 }),
  );
  expect(position.value.x).toBeCloseTo(startX + 20);
  await ReactTestRenderer.act(async () =>
    node.props.onPanResponderMove(null, { dx: 10000, dy: -10000 }),
  );
  expect(position.value).toEqual({ x: 360, y: 0 });
});

test('double pressing a node opens the matching target once', async () => {
  const onOpen = jest.fn();
  const now = jest.spyOn(Date, 'now').mockReturnValue(1000);
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <GalaxyGraph data={data} onNodeDoublePress={onOpen} />,
    );
  });
  const node = renderer.root
    .findAllByType('AnimatedView' as any)
    .find(view => view.props.onPanResponderGrant)!;
  const gesture = { dx: 0, dy: 0, vx: 0, vy: 0 };
  await ReactTestRenderer.act(async () => {
    node.props.onPanResponderGrant();
    node.props.onPanResponderRelease(null, gesture);
  });
  now.mockReturnValue(1100);
  await ReactTestRenderer.act(async () => {
    node.props.onPanResponderGrant();
    node.props.onPanResponderRelease(null, gesture);
  });
  expect(onOpen).toHaveBeenCalledTimes(1);
  expect(onOpen).toHaveBeenCalledWith('one', 'First target');
});
