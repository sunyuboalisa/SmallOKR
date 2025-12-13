import React, { useContext, useEffect, useState } from 'react';
import {
  PanResponder,
  GestureResponderEvent,
  Dimensions,
  View,
} from 'react-native';
import Svg, {
  Circle,
  FeDropShadow,
  Filter,
  G,
  Line,
  Text,
  Defs,
  RadialGradient, // <-- 导入 RadialGradient
  Stop, // <-- 导入 Stop
} from 'react-native-svg';
import { ThemeContext } from '../state/ThemeContext';

class PseudoRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // 生成 [0, 1) 之间的伪随机数
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

interface Node {
  id: number;
  x: number;
  y: number;
  title: string;
}

interface Connection {
  fromNodeId: number;
  toNodeId: number;
}

interface GalaxyGraphProps {
  data: string[];
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const GalaxyGraph: React.FC<GalaxyGraphProps> = ({ data }) => {
  const { width, height } = Dimensions.get('window');
  const rng = new PseudoRandom(33);
  const particleRng = new PseudoRandom(Date.now());

  const generateCoordinates = (titles: string[]) => {
    // 保持您原有的随机坐标生成逻辑
    const center = { x: width / 2, y: height / 2 };
    const radius = Math.min(width, height) / 2;

    return titles.map((title, index) => {
      const angle = rng.next() * 2 * Math.PI;
      const r = Math.sqrt(rng.next()) * radius;
      const x = center.x + r * Math.cos(angle);
      const y = center.y + r * Math.sin(angle);
      return { id: index, x, y, title };
    });
  };

  const [nodes, setNodes] = useState<Node[]>([
    { id: 1, x: 0, y: 0, title: '1' },
    { id: 2, x: 100, y: 100, title: '2' },
    { id: 3, x: 150, y: 200, title: '3' },
    { id: 4, x: 300, y: 100, title: '4' },
    { id: 5, x: 250, y: 200, title: '5' },
  ]);

  const [connections] = useState<Connection[]>([
    // {fromNodeId: 1, toNodeId: 2}
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null);
  const [initialPressPoint, setInitialPressPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  // 辅助函数：根据事件坐标找到被按下的节点 ID
  const findNodeIdAtCoordinates = (x: number, y: number): number | null => {
    const hitRadius = 30;
    const foundNode = nodes.find(node => {
      const distance = Math.sqrt(
        Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2),
      );
      return distance <= hitRadius;
    });
    return foundNode ? foundNode.id : null;
  };

  // handlePress 逻辑 (保持不变)
  const handlePress = (event: GestureResponderEvent, id: number | null) => {
    setInitialPressPoint({
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    });
    setDraggedNodeId(id);
  };

  const panResponder = PanResponder.create({
    // PanResponder 逻辑 (保持不变)
    onStartShouldSetPanResponder: (evt, gestureState) => {
      const id = findNodeIdAtCoordinates(
        evt.nativeEvent.locationX,
        evt.nativeEvent.locationY,
      );
      if (id !== null) {
        setDraggedNodeId(id);
        return true;
      }
      return false;
    },
    onMoveShouldSetPanResponder: () => true,

    onPanResponderMove: (_, gesture) => {
      if (draggedNodeId !== null) {
        const updatedNodes = nodes.map(node =>
          node.id === draggedNodeId
            ? { ...node, x: node.x + gesture.dx, y: node.y + gesture.dy }
            : node,
        );
        setNodes(updatedNodes);
      }
    },

    onPanResponderRelease: (evt, gesture) => {
      const clickTolerance = 5;

      if (draggedNodeId !== null) {
        if (
          Math.abs(gesture.dx) <= clickTolerance &&
          Math.abs(gesture.dy) <= clickTolerance
        ) {
          setSelectedNodeId(prevId =>
            prevId === draggedNodeId ? null : draggedNodeId,
          );
        } else {
          // 动作是“拖动”
        }
      }

      setDraggedNodeId(null);
      setInitialPressPoint(null);
    },

    onPanResponderTerminate: () => {
      setDraggedNodeId(null);
      setInitialPressPoint(null);
    },
  });

  // 全局粒子动画效果 (保持不变)
  useEffect(() => {
    const maxParticles = 80;
    const animationSpeedFactor = 0.005;

    const animate = () => {
      setParticles(prevParticles => {
        let newParticles = prevParticles
          .map(p => {
            const newLife = p.life - animationSpeedFactor;
            return {
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              life: newLife,
            };
          })
          .filter(p => p.life > 0);

        if (newParticles.length < maxParticles) {
          const particlesToGenerate = maxParticles - newParticles.length;
          for (let i = 0; i < particlesToGenerate; i++) {
            const randomX = particleRng.next() * width;
            const randomY = particleRng.next() * height;

            const angle = particleRng.next() * 2 * Math.PI;
            const speed = particleRng.next() * 0.1 * animationSpeedFactor * 100;

            newParticles.push({
              id: particleRng.next() * 1000000,
              x: randomX,
              y: randomY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              life: 1,
            });
          }
        }
        return newParticles;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const animationFrameRef = { current: 0 };
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [width, height]);

  useEffect(() => {
    const temp = generateCoordinates(data);
    setNodes(temp);
  }, [data, width, height]);

  const themeContext = useContext(ThemeContext);
  const nodeRadius = 20;

  // 定义星球渐变色标
  const planetGradientStops = [
    // 亮部（使用主题 primary 色作为高光）
    {
      offset: '0%',
      color: themeContext?.theme.colors.card || '#00FFFF',
      opacity: 1,
    },
    {
      offset: '40%',
      color: themeContext?.theme.colors.card || '#00FFFF',
      opacity: 0.9,
    },
    // 阴影/过渡区（使用黑色 text 或深灰色）
    {
      offset: '80%',
      color: themeContext?.theme.colors.text || '#000000',
      opacity: 0.6,
    },
    {
      offset: '100%',
      color: themeContext?.theme.colors.card || '#333333',
      opacity: 0.8,
    }, // 边缘使用卡片色作为柔和过渡
  ];
  return (
    <Svg width={width} height={height}>
      <Defs>
        {/* 1. 保持原有的 DropShadow Filter (用于光晕) */}
        <Filter id="glow">
          <FeDropShadow
            dx="0"
            dy="0"
            stdDeviation="4"
            floodColor={themeContext?.theme.colors.primary}
            floodOpacity="0.8"
          />
        </Filter>

        {/* 2. 新增星球光照渐变 */}
        <RadialGradient
          id="planetGradient"
          cx="40%" // 渐变中心 X 偏移，模拟左上角光源
          cy="40%" // 渐变中心 Y 偏移
          r="70%" // 渐变半径
          fx="50%" // 焦点 X
          fy="50%" // 焦点 Y
        >
          {planetGradientStops.map((stop, index) => (
            <Stop
              key={index}
              offset={stop.offset}
              stopColor={stop.color}
              stopOpacity={stop.opacity}
            />
          ))}
        </RadialGradient>
      </Defs>

      {/* 渲染粒子效果 (作为背景) */}
      {particles.map(p => (
        <Circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r={p.life * 0.5 + 0.5}
          fill={themeContext?.theme.colors.text || '#FFFFFF'}
          opacity={p.life * 0.8}
        />
      ))}

      {/* 渲染连线 */}
      {connections.map((connection, index) => {
        const fromNode = nodes.find(node => node.id === connection.fromNodeId);
        const toNode = nodes.find(node => node.id === connection.toNodeId);

        if (fromNode && toNode) {
          return (
            <Line
              key={index}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={themeContext?.theme.colors.text}
            />
          );
        }

        return null;
      })}

      {/* 渲染节点 */}
      {nodes.map((node, index) => (
        <G
          key={node.id} // 使用 node.id 作为 key
          {...panResponder.panHandlers}
          onPressIn={event => handlePress(event, node.id)}
        >
          {/* 渲染选中/拖动时的光晕 */}
          {(selectedNodeId === node.id || draggedNodeId === node.id) && (
            <>
              {/* 最外层光晕 */}
              <Circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius + 8}
                fill={themeContext?.theme.colors.primary}
                opacity={0.15}
              />
              {/* 中层光晕 */}
              <Circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius + 4}
                fill={themeContext?.theme.colors.primary}
                opacity={0.3}
              />
            </>
          )}

          {/* 核心星球圆 */}
          <Circle
            key={index + 'circle'}
            cx={node.x}
            cy={node.y}
            r={nodeRadius}
            // **** 核心修改：使用定义的渐变填充 ****
            fill="url(#planetGradient)"
          />

          {/* 节点文本 */}
          <Text
            fill={themeContext?.theme.colors.text}
            key={index + 'text'}
            x={node.x}
            y={node.y}
            dy="0.3em"
            fontSize={20}
            alignmentBaseline="middle"
            textAnchor="middle"
          >
            {node.title}
          </Text>
        </G>
      ))}
    </Svg>
  );
};

export default GalaxyGraph;
