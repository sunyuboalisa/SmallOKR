import { IResult, ITarget, ITodo, IUITodo } from '../model/OKRModel';
import { User } from '../model/User';

export type TodoAction =
  | {
      type: 'Add';
      newTodo: ITodo;
      uiTodo: IUITodo;
    }
  | { type: 'Load'; newTodos: ITodo[] }
  | { type: 'Reload'; reload: boolean };
export type TargetAction =
  | { type: 'Add'; newTarget: ITarget; group: string }
  | { type: 'Update'; newTarget: ITarget; group: string }
  | { type: 'Delete'; oldTarget: ITarget; group: string }
  | { type: 'Load'; targets: ITarget[] }
  | { type: 'LoadResult'; results: IResult[] }
  | { type: 'AddResult'; newResult: IResult }
  | { type: 'ChangeResult'; newResult: IResult }
  | { type: 'Reload'; reload: boolean };
export type UserAction =
  | { type: 'Login'; user: User }
  | { type: 'Logout'; user: User }
  | { type: 'Loading' }
  | { type: 'Loaded' };
