import { Model } from './model';

export namespace Icon {
  export interface IIcon extends Model.IModel {
    id: number;
    word: string;
    descriptor: string;
    category: number;
    icon: string;
    md5: string;
  }

  // interface IDatum extends Model.IDatum<IIcon> {}
  // interface IData extends Model.IData<IIcon> {}

  export interface IRequestBody extends Model.IRequestBody {}
  export interface IResponseBody
    extends Model.IResponseBody<IIcon>,
      Partial<Model.ISuccessResponse>,
      Partial<Model.IErrorResponse> {}
  export interface IResponseBodyList
    extends Model.IResponseBodyList<IIcon>,
      Partial<Model.ISuccessResponse>,
      Partial<Model.IErrorResponse> {}
  export interface IClientData extends Model.IClientData<IIcon> {}
  export interface IClientDataList extends Model.IClientDataList<IIcon> {}
}
