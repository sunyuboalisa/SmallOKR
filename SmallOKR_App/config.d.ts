import { MyStackParamList } from './src/common/NativeScreenTypes';

declare global {
  namespace MyReactNavigation {
    interface ParamList extends MyStackParamList {}
  }
}
