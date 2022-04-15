import { JSONSchemaType } from 'ajv';
import { NextFunction, Request, Response } from 'express';
import { Send } from 'express-serve-static-core';
import CustomError from './utils/CustomError';
export interface ResponseBody<ResponseBodyDataType = any> {
    data?: ResponseBodyDataType;
    message?: string;
}
export interface ResponseBodyWithOutData extends Omit<ResponseBody, 'data'> {
}
/**
 * only for type check purpose,
 * since any type in 'data' field is not representable by JSONSchemaType
 */
export declare const responeBodyWithOutDataJSONSchema: JSONSchemaType<ResponseBodyWithOutData>;
export declare const responseBodyWithAnyDataJSONSchema: {
    readonly type: "object";
    readonly properties: {
        readonly message: {
            readonly type: "string";
            readonly nullable: true;
        };
        readonly data: {};
    };
    readonly additionalProperties: false;
};
export interface TypedAndCheckedResponse<ResponseBodyDataType> extends Response<ResponseBody<ResponseBodyDataType>> {
    send: Send<ResponseBody<ResponseBodyDataType>, this>;
}
export interface AuthJWT {
    id: string;
    iat: number;
    exp: number;
    isOwner: boolean;
    owner: string;
}
export interface TypedPrivateRequest<RequestBodyType> extends Request<{}, any, RequestBodyType> {
    user: AuthJWT;
}
export interface TypedRequest<RequestBodyType> extends Request<{}, any, RequestBodyType> {
}
export interface NextWithCustomError extends NextFunction {
    (...err: ConstructorParameters<typeof CustomError>): void;
}
export declare type TypedPrivateRequestHandler<RequestBodyType, ResponseBodyDataType> = ((req: TypedPrivateRequest<RequestBodyType>, res: Response<ResponseBody<ResponseBodyDataType>>, next: NextWithCustomError) => void) | ((req: TypedPrivateRequest<RequestBodyType>, res: Response<ResponseBody<ResponseBodyDataType>>, next: NextWithCustomError) => Promise<any>);
export declare type TypedRequestHandler<RequestBodyType, ResponseBodyDataType> = ((req: TypedRequest<RequestBodyType>, res: Response<ResponseBody<ResponseBodyDataType>>, next: NextWithCustomError) => void) | ((req: TypedRequest<RequestBodyType>, res: Response<ResponseBody<ResponseBodyDataType>>, next: NextWithCustomError) => Promise<any>);
