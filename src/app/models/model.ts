import { IPagination } from '../interfaces/pagination.interface';

export namespace Model {
  export interface IDatum<IModel> {
    data: IModel;
  }
  export interface IData<IModel> {
    data: IModel[];
    pagination: IPagination;
  }
  interface IClientDataCommon {
    retrieved: Date;
  }

  export interface IModel {}
  export interface IRequestBody extends Partial<IModel> {}
  export interface IResponseBody {}
  export interface IResponseBodyList {}
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
