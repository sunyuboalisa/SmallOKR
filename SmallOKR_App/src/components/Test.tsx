import React, { useRef } from 'react';
import { View, PanResponder } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

const DraggableForceDirectedGraph: React.FC = () => {
  const circleRef = useRef<Circle>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (circleRef.current) {
          // 获取圆心坐标
          const x = gestureState.moveX;
          const y = gestureState.moveY;

          // 更新圆的位置
          circleRef.current.setNativeProps({
            cx: x,
            cy: y
          });

          // 简单的定向规则：如果圆移到右侧，画一条线连接到右边
          // 否则，删除右边的线
          if (x > 150) {
            circleRef.current.setNativeProps({
              fill: 'red'
            });
          } else {
            circleRef.current.setNativeProps({
              fill: 'blue'
            });
          }
        }
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }}>
      <Svg
        width="1000"
        height="1000"
      >
        <Line
          x1="150"
          y1="0"
          x2="150"
          y2="500"
          stroke="black"
          strokeWidth="2"
        />
        <Circle
          ref={circleRef}
          cx={100} // 初始位置
          cy={100} // 初始位置
          r={20}
          fill="blue"
          {...panResponder.panHandlers}
        />
      </Svg>
    </View>
  );
};

export default DraggableForceDirectedGraph;
