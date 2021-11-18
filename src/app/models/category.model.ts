import { Model } from './model';
import { TreeNode } from './data-structures/tree'

export namespace Category {
  export interface ICategory {
    id: number;
    name: string;
    parent: number;
    path: string;
    children?: ICategory[];
  }
  export interface IResponseBody extends Model.IResponseBody, ICategory {}
  export interface IResponseBodyList
    extends Model.IResponseBodyList<ICategory> {}
  export interface IClientData extends Model.IClientData, ICategory {}
  export interface IClientDataList
    extends Model.IClientDataList,
      IResponseBodyList {}
  export interface IRequestBody extends Model.IRequestBody {
    id?: number;
    name: string;
    parent?: number;
    path?: string;
  }
  export interface ISuccessResponse {
    success: string;
  }
  export interface IErrorResponse {
    errors?: string[];
  }
  export type IResponse = ISuccessResponse | IErrorResponse;
  export const emptyList: Category.IClientDataList = {
    results: [],
    retrieved: new Date(),
  };
  export type ITreeNode = TreeNode<{
    id: number;
    name: string;
    children: ITreeNode[];
  }>;
}
