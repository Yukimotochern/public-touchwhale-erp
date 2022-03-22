export interface MongooseStamps {
    createdAt: Date | string;
    updatedAt: Date | string;
}
export interface MongooseStatics {
    _id: string;
    __v: number;
}
export declare const MongooseStampsJSONSchema: {
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
export declare const MongooseStaticsJSONSchema: {
    readonly _id: {
        readonly type: "string";
    };
    readonly __v: {
        readonly type: "number";
    };
};
