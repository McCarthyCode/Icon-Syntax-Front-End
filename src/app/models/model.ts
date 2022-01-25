import { IPagination } from '../interfaces/pagination.interface';

export namespace Model {
  export interface IModel {}

  export interface IDatum<IModel> {
    data: IModel;
  }
  export interface IData<IModel> {
    data: IModel[];
  }
  interface IClientDataCommon {
    retrieved: Date;
  }

  export interface IRequestBody extends Partial<IModel> {}
  export interface IResponseBody<T> extends IDatum<T> {}
  export interface IResponseBodyList<T> extends IData<T> {
    pagination: IPagination;
  }
  export interface IClientData<T> extends IDatum<T>, IClientDataCommon {}
  export interface IClientDataList<T> extends IData<T>, IClientDataCommon {}

  export interface ISuccessResponse {
    success: string;
  }
  export interface IErrorResponse {
    errors: string[];
  }
  export type IResponse = ISuccessResponse | IErrorResponse;
}
