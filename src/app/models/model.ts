import { IPagination } from '../interfaces/pagination.interface';

export namespace Model {
  interface IDatum<IModel> {
    data: IModel;
  }
  interface IData<IModel> {
    data: IModel[];
    pagination: IPagination;
  }
  interface IClientDataCommon {
    retrieved: Date;
  }

  export interface IModel {}
  export interface IRequestBody extends Partial<IModel> {}
  export interface IResponseBody extends IDatum<IModel> {}
  export interface IResponseBodyList extends IData<IModel> {}
  export interface IClientData extends IDatum<IModel>, IClientDataCommon {}
  export interface IClientDataList extends IData<IModel>, IClientDataCommon {}

  export interface ISuccessResponse {
    success: string;
  }
  export interface IErrorResponse {
    errors: string[];
  }
  export type IResponse = ISuccessResponse | IErrorResponse;
}
