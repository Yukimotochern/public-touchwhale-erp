import { Types } from 'mongoose';
/**
 * * Item
 */
export declare namespace TwItemType {
    interface Classifier {
        owner: Types.ObjectId | string;
    }
    interface Editable {
        name: string;
        unit: string;
        custom_id: string;
        count_stock: boolean;
        item_type: 'set' | 'element';
        image: string[];
        element: Types.ObjectId | string | TwItemSetDetailType.PlainTwItemSetDetail;
    }
    interface PlainTwItem extends Classifier, Editable {
    }
}
/**
 * * Item Set
 */
export declare namespace TwItemSetDetailType {
    interface Classifier {
        owner: Types.ObjectId | string;
    }
    interface Identity {
        parentItem: Types.ObjectId | string;
    }
    interface Editable {
        elements: SetMembers[];
    }
    interface SetMembers {
        qty: number;
        id: Types.ObjectId | string;
    }
    interface PlainTwItemSetDetail extends Classifier, Identity, Editable {
    }
}
