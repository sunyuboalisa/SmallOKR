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

const GalaxyGraph: React.FC<GalaxyGraphProps> = ({ data }) => {
  const { width, height } = Dimensions.get('window');

  const generateCoordinates = (titles: string[]) => {
    const rng = new PseudoRandom(33);
    // 生成随机角度和随机半径
    const center = { x: width / 2, y: height / 2 }; // 画布中心点
    const radius = Math.min(width, height) / 2; // 形状半径
    // const density = titles.length / (Math.PI * radius * radius); // 密度
    return titles.map((title, index) => {
      // 计算节点的坐标
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
  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null); // 新增状态：记录正在拖动的节点ID
  const [initialPressPoint, setInitialPressPoint] = useState<{
    x: number;
    y: number;
  } | null>(null); // 记录初始点击位置

  // 辅助函数：根据事件坐标找到被按下的节点 ID
  const findNodeIdAtCoordinates = (x: number, y: number): number | null => {
    // 遍历所有节点，检查 (x, y) 是否在任一节点的半径范围内
    const hitRadius = 30; // 扩大点击区域，便于操作
    const foundNode = nodes.find(node => {
      const distance = Math.sqrt(
        Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2),
      );
      return distance <= hitRadius;
    });
    return foundNode ? foundNode.id : null;
  };
  // 修正 handlePress 逻辑，它现在只负责设置初始点击信息
  const handlePress = (event: GestureResponderEvent, id: number | null) => {
    // 记录手指按下的位置，用于后续区分点击和拖动
    setInitialPressPoint({
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    });
    // 记录被按下的节点ID
    setDraggedNodeId(id);
  };
  const panResponder = PanResponder.create({
    // 无论是否选中，只要在节点上按下就应该准备响应
    onStartShouldSetPanResponder: (evt, gestureState) => {
      // 找到被按下的节点ID
      const id = findNodeIdAtCoordinates(
        evt.nativeEvent.locationX,
        evt.nativeEvent.locationY,
      );
      if (id !== null) {
        // 如果找到了节点，则允许PanResponder响应
        setDraggedNodeId(id);
        return true;
      }
      return false; // 没按到节点，不响应拖动
    },
    onMoveShouldSetPanResponder: () => true, // 允许移动时也响应

    onPanResponderMove: (_, gesture) => {
      if (draggedNodeId !== null) {
        // 使用 draggedNodeId 而不是 selectedNodeId
        const updatedNodes = nodes.map(node =>
          node.id === draggedNodeId
            ? { ...node, x: node.x + gesture.dx, y: node.y + gesture.dy }
            : node,
        );
        setNodes(updatedNodes);
      }
    },

    onPanResponderRelease: (evt, gesture) => {
      const clickTolerance = 5; // 允许的最小移动距离

      if (draggedNodeId !== null) {
        // 检查是否发生了实质性的拖动
        if (
          Math.abs(gesture.dx) <= clickTolerance &&
          Math.abs(gesture.dy) <= clickTolerance
        ) {
          // 动作是“点击”：切换选中状态
          setSelectedNodeId(prevId =>
            prevId === draggedNodeId ? null : draggedNodeId,
          );
        } else {
          // 动作是“拖动”：保持当前选中状态不变（可选：可以将拖动节点设为选中）
          // setSelectedNodeId(draggedNodeId); // 如果希望拖动后自动选中，可以加上这行
        }
      }

      // 清理拖动状态
      setDraggedNodeId(null);
      setInitialPressPoint(null);
    },

    // 确保在手势取消时也清理状态
    onPanResponderTerminate: () => {
      setDraggedNodeId(null);
      setInitialPressPoint(null);
    },
  });

  useEffect(() => {
    const temp = generateCoordinates(data);
    setNodes(temp);
  }, [data]);
  const themeContext = useContext(ThemeContext);
  const nodeRadius = 20;
  return (
    <Svg>
      <Filter id="glow">
        <FeDropShadow
          dx="0" // 水平不偏移
          dy="0" // 垂直不偏移
          stdDeviation="4" // 较大的模糊半径，模拟光晕
          floodColor={themeContext?.theme.colors.primary} // 使用主色调作为光晕颜色
          floodOpacity="0.8" // 较高的不透明度
        />
      </Filter>
      {/* 渲染节点之间的关系连线 */}
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
          key={index}
          {...panResponder.panHandlers}
          onPressIn={event => handlePress(event, node.id)}
        >
          {draggedNodeId === node.id && (
            <>
              {/* 最外层光晕：最大半径，最低透明度 */}
              <Circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius + 8}
                fill={themeContext?.theme.colors.primary}
                opacity={0.15}
              />
              {/* 中层光晕：中等半径，中等透明度 */}
              <Circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius + 4}
                fill={themeContext?.theme.colors.primary}
                opacity={0.3}
              />
            </>
          )}
          <Circle
            key={index + 'circle'}
            cx={node.x}
            cy={node.y}
            r={nodeRadius}
            fill={
              draggedNodeId === node.id
                ? themeContext?.theme.colors.primary
                : themeContext?.theme.colors.card
            }
          />
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
