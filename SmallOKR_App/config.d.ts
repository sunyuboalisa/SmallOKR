import { StackParamList } from './src/common/Pages';

declare global {
  namespace MyReactNavigation {
    interface ParamList extends StackParamList {}
  }
}
