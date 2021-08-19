import { Model } from './model';

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
}
