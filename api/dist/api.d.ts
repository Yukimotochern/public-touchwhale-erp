import { ResponseBody, ResponseBodyWithOutData, TypedPrivateRequestHandler } from './apiTypes';
import { ValidateFunction, JSONSchemaType, AnySchema } from 'ajv';
import { AnyValidateFunction } from 'ajv/dist/types/index';
import { AxiosRequestConfig, Method } from 'axios';
import { ApiPromise } from './utils/ApiPromise';
import CustomError, { ApiErrorDealtInternallyAndThrown } from './utils/CustomError';
import { RequestHandler, Response } from 'express';
interface SchemaOption<RequestBodyType, ResponseDataType> {
    bodySchema: JSONSchemaType<RequestBodyType>;
    dataSchema: JSONSchemaType<ResponseDataType>;
}
export default class api<RequestBodyType, ResponseDataType> {
    bodyValidator: ValidateFunction<RequestBodyType>;
    dataValidator: ValidateFunction<ResponseDataType>;
    resWithAnyDataValidator: ValidateFunction<ResponseBody<any>>;
    resValidator: AnyValidateFunction<ResponseBody<ResponseDataType>>;
    onUnAuthoried?: Function;
    onNetworkError?: Function;
    onUnknownError?: Function;
    constructor({ bodySchema, dataSchema, }?: Partial<SchemaOption<RequestBodyType, ResponseDataType>>);
    setDataValidator(dataSchema: AnySchema): this;
    /**
     * * Server Things
     */
    send(res: Response, statusCode?: number, extra?: ResponseBodyWithOutData): Response<any, Record<string, any>>;
    sendData(res: Response, data: ResponseDataType, extra?: ResponseBodyWithOutData, statusCode?: number): CustomError | Response<any, Record<string, any>>;
    createPrivateController(typedController: TypedPrivateRequestHandler<RequestBodyType, ResponseDataType>): RequestHandler[];
    /**
     * * Client Things
     */
    request: (url: string, method: Method, data: RequestBodyType | undefined, abortController?: AbortController | undefined, cof?: AxiosRequestConfig<RequestBodyType>) => ApiPromise<ResponseDataType>;
    errorProcessor(innerError: ApiErrorDealtInternallyAndThrown): ApiErrorDealtInternallyAndThrown;
    get: (url: string, abortController?: AbortController | undefined, cof?: AxiosRequestConfig) => ApiPromise<ResponseDataType>;
    post: (url: string, data: RequestBodyType, abortController?: AbortController | undefined, cof?: AxiosRequestConfig) => ApiPromise<ResponseDataType>;
    put: (url: string, data: RequestBodyType, abortController?: AbortController | undefined, cof?: AxiosRequestConfig) => ApiPromise<ResponseDataType>;
    delete: (url: string, data: RequestBodyType | undefined, abortController?: AbortController | undefined, cof?: AxiosRequestConfig) => ApiPromise<ResponseDataType>;
}
export { api };
