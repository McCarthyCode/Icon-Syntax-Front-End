import { Model } from './model';
import { IPagination } from '../interfaces/pagination.interface';

export namespace Icon {
  interface IData {
    word: string;
    descriptor: string;
    category: number;
    icon: string;
    md5: string;
  }
  export interface IModel extends Model.IModel, IData {}
  export interface IRequestBody
    extends Model.IRequestBody,
      Model.IModel,
      Partial<IData> {}
  export interface IResponseBody extends Model.IResponseBody<IModel> {}
  export interface IResponseBodyList extends Model.IResponseBodyList<IModel> {
    pagination: IPagination;
  }
  export interface IClientData extends Model.IClientData<IModel> {}
  export interface IClientDataList extends Model.IClientDataList<IModel> {
  }
}
