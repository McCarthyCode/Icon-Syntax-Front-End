import { Model } from './model';

export namespace Subscription {
  export interface IModel extends Model.IModel {
    email: string;
  }

  export interface IResponseBody extends Model.IResponseBody<IModel> {}
  export interface IResponseBodyList extends Model.IResponseBodyList<IModel> {}
  export interface IClientData extends Model.IClientData<IModel> {}
  export interface IClientDataList extends Model.IClientDataList<IModel> {}
}
