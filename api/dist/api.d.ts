import { ResponseBody } from './apiTypes';
import { ValidateFunction, JSONSchemaType } from 'ajv';
import { AnyValidateFunction } from 'ajv/dist/types/index';
import { AxiosRequestConfig, Method } from 'axios';
import { ApiPromise } from './utils/ApiPromise';
import { ApiErrorDealtInternallyAndThrown } from './utils/CustomError';
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
    constructor({ bodySchema, dataSchema, }: Partial<SchemaOption<ReqestBodyType, ResponseDataType>>);
    /**
     * * Server Things
     * TODO: 1. send
     * TODO: 2. sendData
     */
    /**
     * * Client Things
     */
    _reject: (rejectedError: any) => ApiPromise<ResponseDataType>;
    _resolve: (data: ResponseDataType) => ApiPromise<ResponseDataType>;
    request(url: string, method: Method, data: ReqestBodyType | undefined, abortController?: AbortController, cof?: AxiosRequestConfig<ReqestBodyType>): Promise<ResponseDataType>;
    errorProcessor(innerError: ApiErrorDealtInternallyAndThrown): ApiErrorDealtInternallyAndThrown;
    get(url: string, abortController?: AbortController, cof?: AxiosRequestConfig): Promise<ResponseDataType>;
    post(url: string, data: ReqestBodyType, abortController?: AbortController, cof?: AxiosRequestConfig): Promise<ResponseDataType>;
    put(url: string, data: ReqestBodyType, abortController?: AbortController, cof?: AxiosRequestConfig): Promise<ResponseDataType>;
    delete(url: string, data: ReqestBodyType | undefined, abortController?: AbortController, cof?: AxiosRequestConfig): Promise<ResponseDataType>;
}
export { api };
