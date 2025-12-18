import { IResult, ITarget, ITodo, IUITodo } from '../model/OKRModel';
import { User } from '../model/User';

export type TodoAction =
  | {
      type: 'Add';
      newTodo: ITodo;
      uiTodo: IUITodo;
    }
  | {
      type: 'Delete';
      id: string;
    }
  | { type: 'Load'; newTodos: ITodo[] }
  | { type: 'Reload'; reload: boolean };
export type TargetAction =
  | { type: 'Add'; newTarget: ITarget; group: string }
  | { type: 'Update'; newTarget: ITarget; group: string }
  | { type: 'Delete'; targetId: string }
  | { type: 'Load'; targets: ITarget[] }
  | { type: 'LoadResult'; results: IResult[] }
  | { type: 'AddResult'; newResult: IResult }
  | { type: 'DeleteResult'; resultId: string }
  | { type: 'ChangeResult'; newResult: IResult }
  | { type: 'Reload'; reload: boolean };
export type UserAction =
  | { type: 'Login'; user: User }
  | { type: 'Logout' }
  | { type: 'Loading' }
  | { type: 'Loaded' }
  | { type: 'UpdateNamespaceUrl'; namespaceUrl: string }
  | { type: 'UpdateToken'; token: string };
