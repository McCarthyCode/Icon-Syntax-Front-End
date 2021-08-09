export interface IPagination {
  totalResults: number;
  maxResultsPerPage: number;
  numResultsThisPage: number;
  thisPageNumber: number;
  totalPages: number;
  prevPageExists: boolean;
  nextPageExists: boolean;
}
