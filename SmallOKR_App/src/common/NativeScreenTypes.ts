import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ITarget, ITodo } from '../model/OKRModel';

type EditTargetRouteParams = {
  target: ITarget;
};

export type MyStackParamList = {
  DashBoard: undefined;
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
