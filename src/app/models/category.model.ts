import { Model } from './model';

export namespace Category {
  export interface ICategory extends Model.IModel {
    id: number;
    name: string;
    parent: number;
    path: string;
    children?: ICategory[];
  }

  // interface IDatum extends Model.IDatum<ICategory> {}
  // interface IData extends Model.IData<ICategory> {}

  export interface IRequestBody
    extends Model.IRequestBody,
      Partial<ICategory> {}
  export interface IResponseBody
    extends Model.IResponseBody<ICategory>,
      Partial<Model.ISuccessResponse>,
      Partial<Model.IErrorResponse> {}
  export interface IResponseBodyList
    extends Model.IResponseBodyList<ICategory>,
      Partial<Model.ISuccessResponse>,
      Partial<Model.IErrorResponse> {}
  export interface IClientData extends Model.IClientData<ICategory> {}
  export interface IClientDataList extends Model.IClientDataList<ICategory> {}
}
