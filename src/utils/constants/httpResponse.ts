export enum StatusCode {
    OK = 200,
    NO_CONTENT = 204,
    MOVED_PERMENANTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
}

export const MESSAGES: Record<StatusCode, string> = {
    [StatusCode.OK]: 'OK',
    [StatusCode.NO_CONTENT]: 'No Content',
    [StatusCode.MOVED_PERMENANTLY]: 'Moved Permanently',
    [StatusCode.FOUND]: 'Found',
    [StatusCode.SEE_OTHER]: 'See Other',
    [StatusCode.BAD_REQUEST]: 'Bad Request',
    [StatusCode.UNAUTHORIZED]: 'Unauthorized',
    [StatusCode.FORBIDDEN]: 'Forbidden',
    [StatusCode.NOT_FOUND]: 'Not found',
    [StatusCode.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
    [StatusCode.SERVICE_UNAVAILABLE]: 'Service Unavailable',
}