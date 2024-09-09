import {ITarget, Todo} from '../model/OKRModel';

export type StackParamList = {
  DashBoard: undefined;
  Target: {reload: boolean};
  Todo: undefined;
  Me: undefined;
  AddTodo: {todo: Todo};
  RepeatPage: {todoId: string};
  AddTarget: {target: ITarget};
  MainApp: undefined;
  Login: undefined;
};
