export namespace Auth {
  export interface ICredentials {
    username: string;
    email: string;
    userId: number;
    isAdmin: boolean;
    isVerified: boolean;
    tokens: { access: string; refresh: string };
  }
  export interface ISuccessResponse {
    success: string;
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
