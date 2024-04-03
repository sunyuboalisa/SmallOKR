import {Target} from '../model/OKRModel';

export type Action = {type: string};
export type TargetAction =
  | {type: 'Add'; newTarget: Target; group: string}
  | {type: 'Update'; newTarget: Target; group: string}
  | {type: 'Delete'; oldTarget: Target; group: string};
