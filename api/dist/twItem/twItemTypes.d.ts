import { Types } from 'mongoose';
import { Common } from '../utils/commonJSON';
/**
 * * Item
 */
export declare namespace TwItemType {
    interface Editable {
        name?: string;
        unit?: string;
        custom_id?: string;
        count_stock: boolean;
        item_type: 'set' | 'element';
        image: string[];
    }
    interface TwItem extends Editable, Common {
    }
    interface TwItemWithSetDetail extends Editable, Common {
        set_detail: TwItemSetDetailType.TwItemSetDetail | null;
    }
}
/**
 * * Item Set
 */
export declare namespace TwItemSetDetailType {
    interface Identity {
        parentItem: Types.ObjectId | string;
    }
    interface Editable {
        members: SetMember[];
    }
    interface SetMember {
        qty: number;
        member_id: Types.ObjectId | string;
    }
    interface TwItemSetDetail extends Common, Identity, Editable {
    }
}
