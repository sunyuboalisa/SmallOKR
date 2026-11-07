import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  AppState,
  Easing,
  PanResponder,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { ThemeContext } from '../state/ThemeContext';

export type nodeData = { id: string; name: string };
interface GalaxyGraphProps {
  data: nodeData[];
  active?: boolean;
  onNodeDoublePress?: (nodeId: string, nodeTitle: string) => void;
}
interface GraphNode extends nodeData {
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  duration: number;
}
interface Colors {
  card: string;
  text: string;
  primary: string;
}
const RADIUS = 20;
const clamp = (value: number, max: number) =>
  Math.max(0, Math.min(value, Math.max(0, max)));
function randomGenerator(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Keep the background SVG unchanged; only its native layer opacity animates.
const StarField = memo(
  ({
    width,
    height,
    color,
    active,
  }: {
    width: number;
    height: number;
    color: string;
    active: boolean;
  }) => {
    const opacity = useRef(new Animated.Value(0.7)).current;
    const stars = useMemo(() => {
      const random = randomGenerator(33);
      return Array.from({ length: 80 }, (_, id) => ({
        id,
        x: random() * width,
        y: random() * height,
        radius: random() * 0.5 + 0.5,
        opacity: random() * 0.6 + 0.2,
      }));
    }, [width, height]);
    useEffect(() => {
      if (!active) return;
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.4,
            duration: 4000,
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(opacity, {
            toValue: 0.9,
            duration: 4000,
            useNativeDriver: true,
            isInteraction: false,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    }, [active, opacity]);
    return (
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { opacity }]}
      >
        <Svg width={width} height={height}>
          {stars.map(star => (
            <Circle
              key={star.id}
              cx={star.x}
              cy={star.y}
              r={star.radius}
              fill={color}
              opacity={star.opacity}
            />
          ))}
        </Svg>
      </Animated.View>
    );
  },
);

const FloatingNode = memo(
  ({
    node,
    width,
    height,
    colors,
    active,
    selected,
    onSelect,
    onOpen,
  }: {
    node: GraphNode;
    width: number;
    height: number;
    colors: Colors;
    active: boolean;
    selected: boolean;
    onSelect: (id: string) => void;
    onOpen?: (id: string, name: string) => void;
  }) => {
    const position = useRef(
      new Animated.ValueXY({ x: node.x, y: node.y }),
    ).current;
    const drift = useRef(new Animated.ValueXY()).current;
    const currentPosition = useRef({ x: node.x, y: node.y });
    const dragOrigin = useRef(currentPosition.current);
    const lastPress = useRef<number | null>(null);
    const [dragging, setDragging] = useState(false);
    useEffect(() => {
      position.stopAnimation();
      currentPosition.current = { x: node.x, y: node.y };
      position.setValue(currentPosition.current);
    }, [node.x, node.y, position]);
    useEffect(() => {
      if (!active || dragging) return;
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(drift, {
            toValue: { x: node.driftX, y: node.driftY },
            duration: node.duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(drift, {
            toValue: { x: -node.driftX, y: -node.driftY },
            duration: node.duration * 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(drift, {
            toValue: { x: 0, y: 0 },
            duration: node.duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
            isInteraction: false,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    }, [active, dragging, drift, node.driftX, node.driftY, node.duration]);
    useEffect(() => () => position.stopAnimation(), [position]);
    const responder = useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponder: () => true,
          onPanResponderGrant: () => {
            setDragging(true);
            dragOrigin.current = currentPosition.current;
            position.stopAnimation(value => {
              currentPosition.current = value;
              dragOrigin.current = value;
            });
          },
          onPanResponderMove: (_, gesture) => {
            // Gesture dx/dy are cumulative, so always add them to the initial position.
            currentPosition.current = {
              x: clamp(dragOrigin.current.x + gesture.dx, width - RADIUS * 2),
              y: clamp(dragOrigin.current.y + gesture.dy, height - RADIUS * 2),
            };
            position.setValue(currentPosition.current);
          },
          onPanResponderRelease: (_, gesture) => {
            if (Math.abs(gesture.dx) <= 5 && Math.abs(gesture.dy) <= 5) {
              const now = Date.now();
              if (lastPress.current !== null && now - lastPress.current < 300) {
                lastPress.current = null;
                onOpen?.(node.id, node.name);
              } else {
                lastPress.current = now;
                onSelect(node.id);
              }
            } else {
              lastPress.current = null;
              currentPosition.current = {
                x: clamp(
                  currentPosition.current.x + gesture.vx * 24,
                  width - RADIUS * 2,
                ),
                y: clamp(
                  currentPosition.current.y + gesture.vy * 24,
                  height - RADIUS * 2,
                ),
              };
              Animated.spring(position, {
                toValue: currentPosition.current,
                useNativeDriver: true,
                isInteraction: false,
                speed: 12,
                bounciness: 0,
              }).start();
            }
            setDragging(false);
          },
          onPanResponderTerminate: () => {
            lastPress.current = null;
            setDragging(false);
          },
        }),
      [height, node.id, node.name, onOpen, onSelect, position, width],
    );
    const gradientId = `planet-${node.id}`;
    return (
      <Animated.View
        style={[styles.node, { transform: position.getTranslateTransform() }]}
        {...responder.panHandlers}
      >
        <Animated.View
          style={[styles.planet, { transform: drift.getTranslateTransform() }]}
        >
          <Svg width={56} height={56} style={styles.planetImage}>
            <Defs>
              <RadialGradient
                id={gradientId}
                cx="40%"
                cy="40%"
                r="70%"
                fx="50%"
                fy="50%"
              >
                <Stop offset="0%" stopColor={colors.card} stopOpacity={1} />
                <Stop offset="40%" stopColor={colors.card} stopOpacity={0.9} />
                <Stop offset="80%" stopColor={colors.text} stopOpacity={0.6} />
                <Stop offset="100%" stopColor={colors.card} stopOpacity={0.8} />
              </RadialGradient>
            </Defs>
            {(selected || dragging) && (
              <>
                <Circle
                  cx={28}
                  cy={28}
                  r={28}
                  fill={colors.primary}
                  opacity={0.15}
                />
                <Circle
                  cx={28}
                  cy={28}
                  r={24}
                  fill={colors.primary}
                  opacity={0.3}
                />
              </>
            )}
            <Circle cx={28} cy={28} r={RADIUS} fill={`url(#${gradientId})`} />
          </Svg>
          <Text
            pointerEvents="none"
            numberOfLines={1}
            style={[styles.label, { color: colors.text }]}
          >
            {node.name}
          </Text>
        </Animated.View>
      </Animated.View>
    );
  },
);

const GalaxyGraph = ({
  data,
  active = true,
  onNodeDoublePress,
}: GalaxyGraphProps) => {
  const window = useWindowDimensions();
  const [size, setSize] = useState({
    width: window.width,
    height: window.height,
  });
  const [appActive, setAppActive] = useState(
    AppState.currentState === 'active',
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const theme = useContext(ThemeContext);
  const colors = useMemo(
    () => ({
      card: theme?.theme.colors.card || '#333333',
      text: theme?.theme.colors.text || '#FFFFFF',
      primary: theme?.theme.colors.primary || '#00FFFF',
    }),
    [
      theme?.theme.colors.card,
      theme?.theme.colors.primary,
      theme?.theme.colors.text,
    ],
  );
  const animationActive = active && appActive;
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state =>
      setAppActive(state === 'active'),
    );
    return () => subscription.remove();
  }, []);
  const nodes = useMemo(() => {
    const random = randomGenerator(33);
    const radius = Math.max(
      0,
      Math.min(size.width, size.height) / 2.5 - RADIUS,
    );
    return data.map((item, index) => {
      // Spread targets around the center instead of starting overlapping.
      const angle = -Math.PI / 2 + (index * Math.PI * 2) / data.length;
      const distance = radius * (0.85 + random() * 0.15);
      return {
        ...item,
        x: clamp(
          size.width / 2 + distance * Math.cos(angle) - RADIUS,
          size.width - RADIUS * 2,
        ),
        y: clamp(
          size.height / 2 + distance * Math.sin(angle) - RADIUS,
          size.height - RADIUS * 2,
        ),
        driftX: (random() - 0.5) * 12,
        driftY: (random() - 0.5) * 12,
        duration: 3500 + random() * 2000,
      };
    });
  }, [data, size.width, size.height]);
  const selectNode = useCallback(
    (id: string) => setSelectedId(previous => (previous === id ? null : id)),
    [],
  );
  return (
    <View
      style={styles.container}
      onLayout={event => {
        const { width, height } = event.nativeEvent.layout;
        if (width > 0 && height > 0)
          setSize(previous =>
            previous.width === width && previous.height === height
              ? previous
              : { width, height },
          );
      }}
    >
      <StarField
        width={size.width}
        height={size.height}
        color={colors.text}
        active={animationActive}
      />
      {nodes.map(node => (
        <FloatingNode
          key={node.id}
          node={node}
          width={size.width}
          height={size.height}
          colors={colors}
          active={animationActive}
          selected={selectedId === node.id}
          onSelect={selectNode}
          onOpen={onNodeDoublePress}
        />
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', overflow: 'hidden' },
  node: { position: 'absolute', width: RADIUS * 2, height: RADIUS * 2 },
  planet: {
    width: RADIUS * 2,
    height: RADIUS * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planetImage: { position: 'absolute', left: -8, top: -8 },
  label: {
    position: 'absolute',
    width: 200,
    left: -80,
    fontSize: 20,
    textAlign: 'center',
  },
});
export default memo(GalaxyGraph);
