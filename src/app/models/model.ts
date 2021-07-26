export namespace Model {
  interface IClientDataCommon {
    retrieved: Date;
  }
  export interface IClientData extends IClientDataCommon {}
  export interface IClientDataList extends IClientDataCommon {}
  export interface IRequestBody {}
  export interface IResponseBody {}
  export interface IResponseBodyList<T> {
    results: T[];
  }
}
