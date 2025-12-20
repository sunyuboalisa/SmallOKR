import { MyStackParamList } from './src/common/NativeScreenTypes';

declare global {
  namespace MyReactNavigation {
    interface ParamList extends MyStackParamList {}
  }
}

declare module '@react-navigation/native' {
  // 扩展 Colors 类型，添加 placeholder
  export interface ThemeColors {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    placeholder: string;
  }

  export interface Theme {
    dark: boolean;
    colors: ThemeColors;
    fonts: ThemeFonts;
  }
}
