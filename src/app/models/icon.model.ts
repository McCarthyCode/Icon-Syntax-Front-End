import { Model } from './model';

export namespace Icon {
  interface ICommon {
    id: number;
    word: string;
    descriptor: string;
    partSpeech:
      | null
      | 'adjective'
      | 'adverb'
      | 'connective'
      | 'noun'
      | 'preposition'
      | 'punctuation'
      | 'verb_2_part'
      | 'verb_irregular'
      | 'verb_modal'
      | 'verb_regular';
    tense: null | 'present' | 'present participle' | 'past' | 'past participle';
    icon: string;
  }

  export interface IUserInput extends Model.IUserInput, ICommon {}

  export interface IRequestBody extends Model.IRequestBody, ICommon {}

  export interface IResult extends ICommon {
    md5: string;
  }
  interface IPagination {
    totalResults: number;
    maxResultsPerPage: number;
    numResultsThisPage: number;
    thisPageNumber: number;
    totalPages: number;
    prevPageExists: boolean;
    nextPageExists: boolean;
  }

  export interface IResponseBody extends Model.IUserInput {
    results: IResult[];
    pagination: IPagination;
  }

  export interface IClientData extends Model.IClientData, ICommon {
    md5: string;
  }
}
