import { Model } from './model';
import { IPagination } from '../interfaces/pagination.interface';

export namespace Icon {
  export interface IIcon {
    id: number;
    word: string;
    descriptor: string;
    category: number;
    icon: string;
    md5: string;
  }
  export interface IResponseBody extends Model.IResponseBody, IIcon {}
  export interface IResponseBodyList extends Model.IResponseBodyList<IIcon> {
    pagination: IPagination;
  }
  export interface IClientData extends Model.IClientData, IIcon {}
  export interface IClientDataList extends Model.IClientDataList {
    results: IIcon[];
    pagination: IPagination;
  }
  export interface IRequestBody extends Model.IRequestBody {
    id?: number;
    word: string;
    descriptor: string;
    category: number;
    icon: string;
  }
  export const emptyRequestBody: IRequestBody = {
    icon: null,
    word: '',
    descriptor: '',
    category: null
  };
  export interface ISuccessResponse {
    success: string;
  }
  export interface IErrorResponse {
    errors?: string[];
  }
  export type IResponse = ISuccessResponse | IErrorResponse;
}
