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
    interface TwItemWithSetDetailPopulated extends Editable, Common {
        set_detail: TwItemSetDetailType.PopulatedTwItemSetDetail | null;
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
    interface PopulatedMembers {
        members: PopulatedSetMember[];
    }
    interface SetMember {
        qty: number;
        member: Types.ObjectId | string;
    }
    interface PopulatedSetMember {
        qty: number;
        member: TwItemType.TwItem;
    }
    interface TwItemSetDetail extends Common, Identity, Editable {
    }
    interface PopulatedTwItemSetDetail extends Common, Identity, PopulatedMembers {
    }
}
