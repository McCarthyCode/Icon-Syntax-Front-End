import { Model } from './model';
import { IPagination } from '../interfaces/pagination.interface';

export namespace Icon {
  export interface IIcon {
    id: number;
    word: string;
    descriptor: string;
    icon: string;
    md5: string;
  }
  export interface IResponseBodyList extends Model.IResponseBodyList<IIcon> {
    pagination: IPagination;
  }
  export interface IClientData extends Model.IClientData, IIcon {}
  export interface IClientDataList extends Model.IClientDataList {
    results: IIcon[];
    pagination: IPagination;
  }
  export interface IRequestBody extends Model.IRequestBody {}
}
