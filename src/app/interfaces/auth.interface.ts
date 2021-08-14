export namespace Auth {
  export interface ICredentials {
    username: string;
    email: string;
    tokens: { access: string; refresh: string };
  }
  export interface ISuccessResponse {
    success: string;
    redirect?: string;
    credentials?: ICredentials;
  }
  export interface IErrorResponse {
    errors?: string[];
    username?: string[];
    email?: string[];
    password?: string[];
  }
  export type IResponse = ISuccessResponse | IErrorResponse;
}
