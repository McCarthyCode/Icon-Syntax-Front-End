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
  export interface IResponseBody
    extends Model.IResponseBody,
      IIcon,
      Partial<Model.ISuccessResponse>,
      Partial<Model.IErrorResponse> {}
  export interface IResponseBodyList
    extends Model.IResponseBodyList,
      Partial<Model.ISuccessResponse>,
      Partial<Model.IErrorResponse> {}
  export interface IClientData extends Model.IClientData {}
  export interface IClientDataList extends Model.IClientDataList {}
  export interface IRequestBody extends Model.IRequestBody {}

  export const emptyRequestBody: IRequestBody = {
    icon: null,
    word: '',
    descriptor: '',
    category: null,
  };
}
