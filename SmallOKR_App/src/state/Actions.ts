import {ITarget, Todo} from '../model/OKRModel';

export type TodoAction =
  | {type: 'Add'; newTodo: Todo}
  | {type: 'Load'; newTodos: Todo[]};
export type TargetAction =
  | {type: 'Add'; newTarget: ITarget; group: string}
  | {type: 'Update'; newTarget: ITarget; group: string}
  | {type: 'Delete'; oldTarget: ITarget; group: string}
  | {type: 'Load'; targets: ITarget[]};
