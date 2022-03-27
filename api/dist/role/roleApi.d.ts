import * as UserType from '../user/userTypes';
import { Editable, PlainRole } from './roleTypes';
import { api } from '../api';
import { PermissionGroupNames } from '../permissionTypes';
export declare namespace GetRoles {
    const API: api<any, PlainRole[]>;
}
export declare namespace GetRole {
    const API: api<any, PlainRole>;
}
export declare namespace CreateRole {
    type Body = Editable;
    type Data = PlainRole;
    const API: api<Editable, PlainRole>;
}
export declare namespace UpdateRole {
    interface Body {
        shouldCascade: boolean;
        updates: Partial<Editable>;
    }
    interface Data {
        isUpdateDone: boolean;
        updatedRole?: PlainRole;
        userAffected?: {
            user: UserType.PlainUser;
            shouldAdd: PermissionGroupNames[];
            shouldRemove: PermissionGroupNames[];
        }[];
    }
    const API: api<Body, Data>;
}
export declare namespace DeleteRole {
    interface Data {
        deleted: boolean;
        deletedRole?: PlainRole;
        usersOfThisRole?: UserType.PlainUser[];
    }
    const API: api<any, Data>;
}
