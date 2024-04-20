import {ITarget} from '../model/OKRModel';

export type Action = {type: string};
export type TargetAction =
  | {type: 'Add'; newTarget: ITarget; group: string}
  | {type: 'Update'; newTarget: ITarget; group: string}
  | {type: 'Delete'; oldTarget: ITarget; group: string};
