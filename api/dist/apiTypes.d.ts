import { JSONSchemaType } from 'ajv';
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
