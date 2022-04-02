import { Types } from 'mongoose';
import { MongooseStamps, MongooseStatics } from './mongoTypes';
export interface Owner {
    owner: Types.ObjectId | string;
}
export declare const owner: {
    readonly owner: {
        readonly type: "string";
    };
};
export interface Common extends Owner, MongooseStamps, MongooseStatics {
}
export declare const commonSchema: {
    readonly owner: {
        readonly type: "string";
    };
    readonly _id: {
        readonly type: "string";
    };
    readonly __v: {
        readonly type: "number";
    };
    readonly createdAt: {
        readonly anyOf: readonly [{
            readonly type: "object";
            readonly required: readonly [];
        }, {
            readonly type: "string";
        }];
    };
    readonly updatedAt: {
        readonly anyOf: readonly [{
            readonly type: "object";
            readonly required: readonly [];
        }, {
            readonly type: "string";
        }];
    };
};
