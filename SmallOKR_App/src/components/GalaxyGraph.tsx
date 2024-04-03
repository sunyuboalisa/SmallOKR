import React, {useState} from 'react';
import {PanResponder, GestureResponderEvent} from 'react-native';
import Svg, {Circle, Line} from 'react-native-svg';

interface Node {
  id: number;
  x: number;
  y: number;
}

interface Connection {
  fromNodeId: number;
  toNodeId: number;
}

const GalaxyGraph: React.FC = () => {
  const handlePress = (x: GestureResponderEvent, id: number | null) => {
    setSelectedNodeId(id);
  };
  const [nodes, setNodes] = useState<Node[]>([
    {id: 1, x: 0, y: 0},
    {id: 2, x: 100, y: 100},
    {id: 3, x: 150, y: 200},
    {id: 4, x: 300, y: 100},
    {id: 5, x: 250, y: 200},
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    {fromNodeId: 1, toNodeId: 2},
    {fromNodeId: 2, toNodeId: 3},
    {fromNodeId: 3, toNodeId: 4},
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

  return (
    <Svg>
      {/* 渲染节点 */}
      {nodes.map(node => (
        <Circle
          onPressIn={event => handlePress(event, node.id)}
          key={node.id}
          cx={node.x}
          cy={node.y}
          r={20}
          fill={selectedNodeId === node.id ? 'red' : 'blue'}
          {...(selectedNodeId === node.id ? panResponder.panHandlers : {})}
        />
      ))}
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
              stroke="black"
            />
          );
        }

        return null;
      })}
    </Svg>
  );
};

export default GalaxyGraph;
