import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ITarget, ITodo } from '../model/OKRModel';
import { NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
type TargetStackParamList = {
  Target: { reload: boolean };
  EditTarget: EditTargetRouteParams;
};
type EditTargetRouteParams = {
  target: ITarget;
};

export type MyStackParamList = {
  TargetTab: NavigatorScreenParams<TargetStackParamList> & { reload?: boolean };
  TodoTab: undefined;
  MeTab: undefined;
  Dashboard: undefined;
  Target: { reload: boolean };
  Todo: undefined;
  Me: undefined;
  EditTodo: { todo: ITodo };
  RepeatPage: { todoId: string };
  EditTarget: EditTargetRouteParams;
  MainApp: undefined;
  Login: undefined;
  PersonalInfo: undefined;
  BehaviorAnalysis: undefined;
  ChangePassword: undefined;
  ForgotPassword: undefined;
  Register: undefined;
};

export type MyStackScreenProps<RouteName extends keyof MyStackParamList> =
  NativeStackScreenProps<MyStackParamList, RouteName>;

export type MyTabScreenProps<RouteName extends keyof MyStackParamList> =
  BottomTabScreenProps<MyStackParamList, RouteName>;
