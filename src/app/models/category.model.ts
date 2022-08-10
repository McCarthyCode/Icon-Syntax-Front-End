import { Model } from './model';
import { TreeNode } from './data-structures/tree';

export namespace Category {
  interface IData {
    name: string;
    parent: number;
    path: string;
    children?: IModel[];
  }
  export interface IModel extends Model.IModel, IData {}
  export interface IResponseBody extends Model.IResponseBody<IModel> {}
  export interface IResponseBodyList extends Model.IResponseBodyList<IModel> {}
  export interface IClientData extends Model.IClientData<IModel> {}
  export interface IClientDataList extends Model.IClientDataList<IModel> {}

  export type ITreeNode = TreeNode<{
    id: number;
    name: string;
    children: ITreeNode[];
  }>;
}
