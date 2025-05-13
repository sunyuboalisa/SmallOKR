import {ITarget, Todo} from '../model/OKRModel';

export type StackParamList = {
  DashBoard: undefined;
  Target: {reload: boolean};
  Todo: undefined;
  Me: undefined;
  EditTodo: {todo: Todo};
  RepeatPage: {todoId: string};
  EditTarget: {target: ITarget};
  MainApp: undefined;
  Login: undefined;
};
