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
    constructor({ bodySchema, dataSchema, }: Partial<SchemaOption<ReqestBodyType, ResponseDataType>>);
    _reject: (rejectedError: any) => ApiPromise<unknown>;
    _resolve: (data: ResponseDataType | undefined) => ApiPromise<unknown>;
    request(url: string, method: Method, data: ReqestBodyType | undefined, abortController?: AbortController | undefined, cof?: AxiosRequestConfig<ReqestBodyType>): Promise<unknown>;
    errorProcessor(innerError: ApiErrorDealtInternallyAndThrown): ApiErrorDealtInternallyAndThrown;
    get(url: string, cof?: AxiosRequestConfig, abortController?: AbortController | undefined): Promise<unknown>;
    post(url: string, data: ReqestBodyType, cof?: AxiosRequestConfig, abortController?: AbortController | undefined): Promise<unknown>;
    put(url: string, data: ReqestBodyType, cof?: AxiosRequestConfig, abortController?: AbortController | undefined): Promise<unknown>;
    delete(url: string, data: ReqestBodyType | undefined, cof?: AxiosRequestConfig, abortController?: AbortController | undefined): Promise<unknown>;
}
export { api };
