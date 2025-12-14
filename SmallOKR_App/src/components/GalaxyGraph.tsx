import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useReducer,
} from 'react';
import { PanResponder, GestureResponderEvent, Dimensions } from 'react-native';
import Svg, {
  Circle,
  G,
  Line,
  Text,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { ThemeContext } from '../state/ThemeContext';

class PseudoRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

interface Node {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  title: string;
}

interface Connection {
  fromNodeId: string;
  toNodeId: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}
export type nodeData = {
  id: string;
  name: string;
};
interface GalaxyGraphProps {
  data: nodeData[];
  onNodeDoublePress?: (nodeId: string, nodeTitle: string) => void;
}

// 辅助 Hook: 强制组件重新渲染 (轻量级)
const useForceUpdate = () => useReducer(x => x + 1, 0)[1];

const GalaxyGraph: React.FC<GalaxyGraphProps> = ({
  data,
  onNodeDoublePress,
}) => {
  const { width, height } = Dimensions.get('window');
  const rng = useRef(new PseudoRandom(33)).current;
  const particleRng = useRef(new PseudoRandom(Date.now())).current;
  const forceUpdate = useForceUpdate();

  const nodesRef = useRef<Node[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const initialPressPoint = useRef<{ x: number; y: number } | null>(null);

  const nodeRadius = 20;
  const themeContext = useContext(ThemeContext);

  useEffect(() => {
    // 初始坐标生成函数
    const generateCoordinates = (nodeDatas: nodeData[]) => {
      const center = { x: width / 2, y: height / 2 };
      const radius = Math.min(width, height) / 2.5;

      return nodeDatas.map(nodeData => {
        const angle = rng.next() * 2 * Math.PI;
        const r = Math.sqrt(rng.next()) * radius;
        const x = center.x + r * Math.cos(angle);
        const y = center.y + r * Math.sin(angle);

        return {
          id: nodeData.id,
          x,
          y,
          title: nodeData.name,
          vx: (rng.next() - 0.5) * 0.1,
          vy: (rng.next() - 0.5) * 0.1,
        };
      });
    };
    const initialData = data; // 默认数据

    nodesRef.current = generateCoordinates(initialData);
    forceUpdate();
  }, [data, width, height, forceUpdate, rng]);

  const findNodeIdAtCoordinates = (x: number, y: number): string | null => {
    const hitRadius = 30;
    const foundNode = nodesRef.current.find(node => {
      const distance = Math.sqrt(
        Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2),
      );
      return distance <= hitRadius;
    });
    return foundNode ? foundNode.id : null;
  };
  const lastPressTime = useRef(0);
  const DOUBLE_PRESS_DELAY = 300; // 双击间隔阈值 (毫秒)
  // ------------------------------------

  // B. 位于 findNodeIdAtCoordinates 函数之后，添加双击处理函数
  // ------------------------------------
  // 辅助函数：处理单击和双击逻辑
  const handleNodePress = (id: string) => {
    const now = Date.now();
    const node = nodesRef.current.find(n => n.id === id); // 获取节点对象

    if (now - lastPressTime.current < DOUBLE_PRESS_DELAY) {
      // 触发双击事件
      if (node && onNodeDoublePress) {
        onNodeDoublePress(id, node.title);
      }
      // 重置时间，防止连续多次触发
      lastPressTime.current = 0;
    } else {
      // 记录第一次点击时间
      lastPressTime.current = now;
    }
  };
  const handlePress = (event: GestureResponderEvent, id: string | null) => {
    initialPressPoint.current = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    };
    if (id !== null) setDraggedNodeId(id);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: evt => {
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
        const nodeIndex = nodesRef.current.findIndex(
          node => node.id === draggedNodeId,
        );
        if (nodeIndex !== -1) {
          nodesRef.current[nodeIndex].x += gesture.dx;
          nodesRef.current[nodeIndex].y += gesture.dy;
          forceUpdate();
        }
      }
    },

    onPanResponderRelease: (evt, gesture) => {
      const clickTolerance = 5;

      if (draggedNodeId !== null) {
        if (
          Math.abs(gesture.dx) <= clickTolerance &&
          Math.abs(gesture.dy) <= clickTolerance
        ) {
          const nodeId = draggedNodeId;
          handleNodePress(nodeId);
          setSelectedNodeId(prevId =>
            prevId === draggedNodeId ? null : draggedNodeId,
          );
        } else {
          // 赋予释放时的惯性速度
          const nodeIndex = nodesRef.current.findIndex(
            node => node.id === draggedNodeId,
          );
          if (nodeIndex !== -1) {
            nodesRef.current[nodeIndex].vx = gesture.vx * 5;
            nodesRef.current[nodeIndex].vy = gesture.vy * 5;
          }
        }
      }

      setDraggedNodeId(null);
      initialPressPoint.current = null;
      forceUpdate();
    },

    onPanResponderTerminate: () => {
      setDraggedNodeId(null);
      initialPressPoint.current = null;
      forceUpdate();
    },
  });

  // ***** 动画循环 (核心逻辑) *****
  useEffect(() => {
    // 动画参数
    const maxParticles = 80;
    const particleAnimationSpeedFactor = 0.005;

    // ****** 调整后的节点动画参数 (实现平滑和自然运动) ******
    const timeStep = 0.1; // 关键：大幅减小时间步进，消除抽搐感
    const friction = 0.99; // 增加摩擦力，平滑加速度

    // 力参数等比例放大 (原值 * 5)
    const repulsionStrength = 400; // 80 * 5
    const randomForceMagnitude = 1.5; // 0.3 * 5
    const centerGravityStrength = 0.04; // 0.008 * 5
    const boundaryStrength = 2.5; // 0.5 * 5
    // ****************************************************

    const boundaryMargin = 30;
    const animate = () => {
      // --- 1. 更新粒子 ---
      let newParticles = particlesRef.current
        .map(p => {
          const newLife = p.life - particleAnimationSpeedFactor;
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
          const speed =
            particleRng.next() * 0.1 * particleAnimationSpeedFactor * 100;

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
      particlesRef.current = newParticles;

      // --- 2. 更新节点 ---
      const center = { x: width / 2, y: height / 2 };
      const currentNodes = nodesRef.current;

      for (let i = 0; i < currentNodes.length; i++) {
        const node = currentNodes[i];

        if (node.id === draggedNodeId) {
          continue;
        }

        let totalFx = 0;
        let totalFy = 0;

        // a) 节点间的排斥力
        for (let j = 0; j < currentNodes.length; j++) {
          const otherNode = currentNodes[j];
          if (i !== j) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distanceSq = dx * dx + dy * dy;

            const minDistanceSq = 4000;
            const forceMagnitude =
              repulsionStrength / Math.max(distanceSq, minDistanceSq);

            totalFx += dx * forceMagnitude;
            totalFy += dy * forceMagnitude;
          }
        }

        // b) 随机漂浮力
        totalFx += (particleRng.next() - 0.5) * randomForceMagnitude;
        totalFy += (particleRng.next() - 0.5) * randomForceMagnitude;

        // c) 向心力/引力
        const dxCenter = center.x - node.x;
        const dyCenter = center.y - node.y;
        totalFx += dxCenter * centerGravityStrength;
        totalFy += dyCenter * centerGravityStrength;

        // d) 柔和边界推力
        const maxDistX = width - nodeRadius - boundaryMargin;
        const minDistX = nodeRadius + boundaryMargin;
        const maxDistY = height - nodeRadius - boundaryMargin;
        const minDistY = nodeRadius + boundaryMargin;

        // X 轴边界推力
        if (node.x > maxDistX) {
          const pushBack = (node.x - maxDistX) * boundaryStrength;
          totalFx -= pushBack;
        } else if (node.x < minDistX) {
          const pushBack = (minDistX - node.x) * boundaryStrength;
          totalFx += pushBack;
        }

        // Y 轴边界推力
        if (node.y > maxDistY) {
          const pushBack = (node.y - maxDistY) * boundaryStrength;
          totalFy -= pushBack;
        } else if (node.y < minDistY) {
          const pushBack = (minDistY - node.y) * boundaryStrength;
          totalFy += pushBack;
        }

        // e) 阻尼和速度更新 (摩擦力更高，吸收抽搐)
        let newVx = (node.vx + totalFx * timeStep) * friction;
        let newVy = (node.vy + totalFy * timeStep) * friction;

        // f) 计算新位置 (小步进，运动更平滑)
        let newX = node.x + newVx * timeStep;
        let newY = node.y + newVy * timeStep;

        // g) 边界钳制 (防止穿透)
        newX = Math.max(nodeRadius, Math.min(newX, width - nodeRadius));
        newY = Math.max(nodeRadius, Math.min(newY, height - nodeRadius));

        // h) 更新 ref 中的值
        node.x = newX;
        node.y = newY;
        node.vx = newVx;
        node.vy = newVy;
      }

      forceUpdate();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const animationFrameRef = { current: 0 };
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [width, height, draggedNodeId, forceUpdate, particleRng]);

  // --- 渲染部分 (保持不变) ---

  const connections = useRef<Connection[]>([]).current;

  const planetGradientStops = [
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
    {
      offset: '80%',
      color: themeContext?.theme.colors.text || '#000000',
      opacity: 0.6,
    },
    {
      offset: '100%',
      color: themeContext?.theme.colors.card || '#333333',
      opacity: 0.8,
    },
  ];

  return (
    <Svg width={width} height={height}>
      <Defs>
        <RadialGradient
          id="planetGradient"
          cx="40%"
          cy="40%"
          r="70%"
          fx="50%"
          fy="50%"
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

      {/* 渲染粒子效果 */}
      {particlesRef.current.map(p => (
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
        const fromNode = nodesRef.current.find(
          node => node.id === connection.fromNodeId,
        );
        const toNode = nodesRef.current.find(
          node => node.id === connection.toNodeId,
        );

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
      {nodesRef.current.map((node, index) => (
        <G
          key={node.id}
          {...panResponder.panHandlers}
          onPressIn={event => handlePress(event, node.id)}
        >
          {/* 渲染选中/拖动时的光晕 */}
          {(selectedNodeId === node.id || draggedNodeId === node.id) && (
            <>
              <Circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius + 8}
                fill={themeContext?.theme.colors.primary}
                opacity={0.15}
              />
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
