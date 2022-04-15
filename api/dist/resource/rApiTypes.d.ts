import { Common } from '../utils/commonJSON';
export declare namespace RType {
    interface Editable {
        name?: string;
        unit?: string;
        custom_id?: string;
        count_stock: boolean;
        item_type: 'set' | 'element';
        image: string[];
    }
    interface R extends Editable, Common {
    }
}
