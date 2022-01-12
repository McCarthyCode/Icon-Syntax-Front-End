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

  export interface IParams {
    id: number;
  }
  export interface IModel {}
  export interface IRequestBody extends Partial<IModel> {}
  export interface IResponseBody extends IDatum<IModel>, IClientDataCommon {}
  export interface IResponseBodyList extends IData<IModel> {}
  export interface IClientData extends IDatum<IModel>, IClientDataCommon {}
  export interface IClientDataList extends IData<IModel>, IClientDataCommon {}

  export function convert(
    body: IResponseBody
  ): IClientData {
    throw new Error(
      'Conversion method from IRequestBody to IClientData must be defined.'
    );
  }

  export function convertList(
    body: IResponseBodyList
  ): IClientDataList {
    throw new Error(
      'Conversion method from IRequestBodyList to IClientDataList must be defined.'
    );
  }
}
