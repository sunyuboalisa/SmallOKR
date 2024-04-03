// declare module 'react-native-webgl';
// d3-force.d.ts

import { StackParamList } from './src/common/Pages';

declare global {
  namespace MyReactNavigation {
    interface ParamList extends StackParamList { }
  }
}