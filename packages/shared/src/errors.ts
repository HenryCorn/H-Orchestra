export enum ParserErrorCode {
  FILE_NOT_FOUND = 'PARSER_FILE_NOT_FOUND',
  INVALID_JSON = 'PARSER_INVALID_JSON',
  MISSING_REQUIRED_FIELD = 'PARSER_MISSING_REQUIRED_FIELD',
  INVALID_STATUS = 'PARSER_INVALID_STATUS',
  INVALID_FRONTMATTER = 'PARSER_INVALID_FRONTMATTER',
  UNKNOWN = 'PARSER_UNKNOWN',
}

export enum RouteErrorCode {
  NOT_FOUND = 'ROUTE_NOT_FOUND',
  CONFLICT = 'ROUTE_CONFLICT',
  VALIDATION_ERROR = 'ROUTE_VALIDATION_ERROR',
  INTERNAL = 'ROUTE_INTERNAL',
}

export type ParserError = {
  code: ParserErrorCode;
  file: string;
  message: string;
  line?: number;
};

export type RouteError = {
  code: RouteErrorCode;
  message: string;
  detail?: string;
};

export type AppError =
  | { kind: 'parser'; error: ParserError }
  | { kind: 'route'; error: RouteError };
