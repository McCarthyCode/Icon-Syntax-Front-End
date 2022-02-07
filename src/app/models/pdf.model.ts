import { Model } from './model';

export namespace PDF {
  export interface IModel extends Model.IModel {
    pdf: string;
    title: string;
    topic: number;
    md5: string;
  }

  export interface IRequestBody extends Model.IRequestBody, Partial<IModel> {}
  export interface IResponseBody extends Model.IResponseBody<IModel> {}
  export interface IResponseBodyList extends Model.IResponseBodyList<IModel> {}
  export interface IClientData extends Model.IClientData<IModel> {}
  export interface IClientDataList extends Model.IClientDataList<IModel> {}
}
