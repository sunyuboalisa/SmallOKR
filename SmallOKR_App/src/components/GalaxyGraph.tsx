import React, {useEffect, useState} from 'react';
import {PanResponder, GestureResponderEvent, Dimensions} from 'react-native';
import Svg, {Circle, Line, Text} from 'react-native-svg';
import {getColor} from '../theme';

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

const GalaxyGraph: React.FC<GalaxyGraphProps> = ({data}) => {
  const {width, height} = Dimensions.get('window');

  const generateCoordinates = (titles: string[]) => {
    const rng = new PseudoRandom(33);
    // 生成随机角度和随机半径
    const center = {x: width / 2, y: height / 2}; // 画布中心点
    const radius = Math.min(width, height) / 2; // 形状半径
    // const density = titles.length / (Math.PI * radius * radius); // 密度
    return titles.map((title, index) => {
      // 计算节点的坐标
      const angle = rng.next() * 2 * Math.PI;
      const r = Math.sqrt(rng.next()) * radius;
      const x = center.x + r * Math.cos(angle);
      const y = center.y + r * Math.sin(angle);
      return {id: index, x, y, title};
    });
  };

  const handlePress = (x: GestureResponderEvent, id: number | null) => {
    setSelectedNodeId(id);
  };

  const [nodes, setNodes] = useState<Node[]>([
    {id: 1, x: 0, y: 0, title: '1'},
    {id: 2, x: 100, y: 100, title: '2'},
    {id: 3, x: 150, y: 200, title: '3'},
    {id: 4, x: 300, y: 100, title: '4'},
    {id: 5, x: 250, y: 200, title: '5'},
  ]);

  const [connections] = useState<Connection[]>([
    // {fromNodeId: 1, toNodeId: 2}
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => {
      const {dx, dy} = gestureState;
      // 判断是否是水平或垂直滑动，防止误触发节点拖动
      return Math.abs(dx) > 5 || Math.abs(dy) > 5;
    },
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      if (selectedNodeId !== null) {
        const updatedNodes = nodes.map(node =>
          node.id === selectedNodeId
            ? {...node, x: node.x + gesture.dx, y: node.y + gesture.dy}
            : node,
        );
        setNodes(updatedNodes);
      }
    },
    onPanResponderRelease: () => {
      setSelectedNodeId(null);
    },
  });

  useEffect(() => {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2; // 设定最大半径为屏幕宽高的1/2
    const temp = generateCoordinates(data, centerX, centerY, maxRadius);
    setNodes(temp);
  }, [data]);

  return (
    <Svg>
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
              stroke="gray"
            />
          );
        }

        return null;
      })}
      {/* 渲染节点 */}
      {nodes.map((node, index) => (
        <>
          <Circle
            onPressIn={event => handlePress(event, node.id)}
            key={index + 'circle'}
            cx={node.x}
            cy={node.y}
            r={20}
            fill={selectedNodeId === node.id ? 'red' : getColor(node.id)}
            {...(selectedNodeId === node.id ? panResponder.panHandlers : {})}
          />
          <Text
            key={index + 'text'}
            x={node.x}
            y={node.y}
            dy="0.3em"
            fontSize={20}
            alignmentBaseline="middle"
            textAnchor="middle">
            {node.title}
          </Text>
        </>
      ))}
    </Svg>
  );
};

export default GalaxyGraph;
