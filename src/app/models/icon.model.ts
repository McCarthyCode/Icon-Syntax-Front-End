import { Model } from './model';
import { IPagination } from './pagination.interface';

export namespace Icon {
  export interface IIcon {
    id: number;
    word: string;
    descriptor: string;
    icon: string;
    md5: string;
  }
  export interface IResponseBody extends Model.IResponseBody {
    results: IIcon[];
    pagination: IPagination;
  }
  export interface IClientData extends Model.IClientData, IResponseBody {}
  export interface IRequestBody extends Model.IRequestBody {}
}
