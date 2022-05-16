import { IPagination } from '../interfaces/pagination.interface';

export namespace Model {
  export interface IModel {
    id: number;
    created: Date;
    updated: Date;
  }

  export interface ISuccessResponse {
    success: string;
  }
  export interface IErrorResponse {
    errors: string[];
  }
  interface IResponseMessage
    extends Partial<ISuccessResponse>,
      Partial<IErrorResponse> {}

  interface IClientDataCommon extends IResponseMessage {
    retrieved: Date;
  }

  export interface IDatum<IModel> extends IResponseMessage {
    data: IModel;
  }
  export interface IData<IModel> extends IResponseMessage {
    data: IModel[];
  }

  export interface IResponseBody<T> extends IDatum<T> {}
  export interface IResponseBodyList<T> extends IData<T> {
    pagination: IPagination;
  }
  export interface IClientData<T> extends IDatum<T>, IClientDataCommon {}
  export interface IClientDataList<T> extends IData<T>, IClientDataCommon {}
}
