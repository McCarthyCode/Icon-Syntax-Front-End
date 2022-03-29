import { Model } from './model';

export namespace PDF {
  export namespace Category {
    export interface IModel extends Model.IModel {
      name: string;
      pdfs?: PDF.IModel[];
      selected?: boolean;
    }

    export interface IResponseBody extends Model.IResponseBody<IModel> {}
    export interface IResponseBodyList
      extends Model.IResponseBodyList<IModel> {}
    export interface IClientData extends Model.IClientData<IModel> {}
    export interface IClientDataList extends Model.IClientDataList<IModel> {}
  }

  export interface IModel extends Model.IModel {
    pdf: string;
    title: string;
    categories: string | Set<string>;
    md5: string;
    topic: number;
  }

  export interface IResponseBody extends Model.IResponseBody<IModel> {}
  export interface IResponseBodyList extends Model.IResponseBodyList<IModel> {}
  export interface IClientData extends Model.IClientData<IModel> {}
  export interface IClientDataList extends Model.IClientDataList<IModel> {}
}
