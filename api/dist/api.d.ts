import { ResponseBody, ResponseBodyWithOutData } from './apiTypes';
import { ValidateFunction, JSONSchemaType } from 'ajv';
import { AnyValidateFunction } from 'ajv/dist/types/index';
import { AxiosRequestConfig, Method } from 'axios';
import { ApiPromise } from './utils/ApiPromise';
import CustomError, { ApiErrorDealtInternallyAndThrown } from './utils/CustomError';
import { Response } from 'express';
interface SchemaOption<ReqestBodyType, ResponseDataType> {
    bodySchema: JSONSchemaType<ReqestBodyType>;
    dataSchema: JSONSchemaType<ResponseDataType>;
}
export default class api<ReqestBodyType, ResponseDataType> {
    bodyValidator: ValidateFunction<ReqestBodyType>;
    dataValidator: ValidateFunction<ResponseDataType>;
    resWithAnyDataValidator: ValidateFunction<ResponseBody<any>>;
    resValidator: AnyValidateFunction<ResponseBody<ResponseDataType>>;
    onUnAuthoried?: Function;
    onNetworkError?: Function;
    onUnknownError?: Function;
    constructor({ bodySchema, dataSchema, }?: Partial<SchemaOption<ReqestBodyType, ResponseDataType>>);
    /**
     * * Server Things
     */
    send(res: Response, statusCode?: number, extra?: ResponseBodyWithOutData): Response<any, Record<string, any>>;
    sendData(res: Response, data: ResponseDataType, extra?: ResponseBodyWithOutData, statusCode?: number): CustomError | Response<any, Record<string, any>>;
    /**
     * * Client Things
     */
    request: (url: string, method: Method, data: ReqestBodyType | undefined, abortController?: AbortController | undefined, cof?: AxiosRequestConfig<ReqestBodyType>) => ApiPromise<ResponseDataType>;
    errorProcessor(innerError: ApiErrorDealtInternallyAndThrown): ApiErrorDealtInternallyAndThrown;
    get: (url: string, abortController?: AbortController | undefined, cof?: AxiosRequestConfig) => ApiPromise<ResponseDataType>;
    post: (url: string, data: ReqestBodyType, abortController?: AbortController | undefined, cof?: AxiosRequestConfig) => ApiPromise<ResponseDataType>;
    put: (url: string, data: ReqestBodyType, abortController?: AbortController | undefined, cof?: AxiosRequestConfig) => ApiPromise<ResponseDataType>;
    delete: (url: string, data: ReqestBodyType | undefined, abortController?: AbortController | undefined, cof?: AxiosRequestConfig) => ApiPromise<ResponseDataType>;
}
export { api };
