import { JSONSchemaType } from 'ajv';
import { TwItemType, TwItemSetDetailType } from './twItemTypes';
import { api } from '../api';
import { AdvancedResult } from '../advancedResult/advancedResultTypes';
export declare const members: {
    readonly type: "array";
    readonly items: {
        readonly type: "object";
        readonly properties: {
            readonly qty: {
                readonly type: "integer";
            };
            readonly member_id: {
                readonly type: "string";
            };
        };
        readonly required: readonly ["member_id", "qty"];
        readonly additionalProperties: false;
    };
};
export declare const twItemSetDetailConstSchema: {
    readonly type: "object";
    readonly properties: {
        readonly parentItem: {
            readonly type: "string";
        };
        readonly members: {
            readonly type: "array";
            readonly items: {
                readonly type: "object";
                readonly properties: {
                    readonly qty: {
                        readonly type: "integer";
                    };
                    readonly member_id: {
                        readonly type: "string";
                    };
                };
                readonly required: readonly ["member_id", "qty"];
                readonly additionalProperties: false;
            };
        };
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
    readonly required: readonly ["owner", "parentItem"];
    readonly additionalProperties: false;
};
export declare const twItemSetDetailSchema: JSONSchemaType<TwItemSetDetailType.TwItemSetDetail>;
export declare const editableProperties: {
    readonly name: {
        readonly type: "string";
        readonly nullable: true;
    };
    readonly unit: {
        readonly type: "string";
        readonly nullable: true;
    };
    readonly custom_id: {
        readonly type: "string";
        readonly nullable: true;
    };
    readonly count_stock: {
        readonly type: "boolean";
    };
    readonly item_type: {
        readonly type: "string";
        readonly enum: readonly ["element", "set"];
    };
    readonly image: {
        readonly type: "array";
        readonly items: {
            readonly type: "string";
        };
        readonly nullable: true;
    };
};
export declare const twItemDefiniteProperties: {
    readonly name: {
        readonly type: "string";
        readonly nullable: true;
    };
    readonly unit: {
        readonly type: "string";
        readonly nullable: true;
    };
    readonly custom_id: {
        readonly type: "string";
        readonly nullable: true;
    };
    readonly count_stock: {
        readonly type: "boolean";
    };
    readonly item_type: {
        readonly type: "string";
        readonly enum: readonly ["element", "set"];
    };
    readonly image: {
        readonly type: "array";
        readonly items: {
            readonly type: "string";
        };
        readonly nullable: true;
    };
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
export declare const twItemWithSetDetailSchema: JSONSchemaType<TwItemType.TwItemWithSetDetail>;
export declare namespace CreateItem {
    interface Body {
        twItem: TwItemType.Editable;
        members?: TwItemSetDetailType.SetMember[];
    }
    type Data = TwItemType.TwItemWithSetDetail;
    const API: api<Body, TwItemType.TwItemWithSetDetail>;
}
export declare namespace UpdateItem {
    interface Body {
        twItem?: Partial<TwItemType.Editable>;
        members?: TwItemSetDetailType.SetMember[];
    }
    type Data = TwItemType.TwItemWithSetDetail;
    const API: api<Body, TwItemType.TwItemWithSetDetail>;
}
export declare namespace GetItem {
    type Data = TwItemType.TwItemWithSetDetail;
    const API: api<any, TwItemType.TwItemWithSetDetail>;
}
export declare namespace GetItemsWithDetail {
    type Data = AdvancedResult<TwItemType.TwItemWithSetDetail[]>;
    const API: api<any, Data>;
}
export declare namespace GetItems {
    type Data = AdvancedResult<TwItemType.TwItem[]>;
    const API: api<any, Data>;
}
export declare namespace GetImageUploadUrl {
    interface Data {
        image: string;
        uploadUrl: string;
    }
    const API: api<any, Data>;
}
