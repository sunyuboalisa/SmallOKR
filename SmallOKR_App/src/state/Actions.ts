import {IResult, ITarget, Todo} from '../model/OKRModel';
import {User} from '../model/User';

export type TodoAction =
  | {type: 'Add'; newTodo: Todo}
  | {type: 'Load'; newTodos: Todo[]}
  | {type: 'Reload'; reload: boolean};
export type TargetAction =
  | {type: 'Add'; newTarget: ITarget; group: string}
  | {type: 'Update'; newTarget: ITarget; group: string}
  | {type: 'Delete'; oldTarget: ITarget; group: string}
  | {type: 'Load'; targets: ITarget[]}
  | {type: 'LoadResult'; results: IResult[]}
  | {type: 'AddResult'; newResult: IResult}
  | {type: 'Reload'; reload: boolean};
export type UserAction = {type: 'Login'; user: User} | {type: 'Logout'};
