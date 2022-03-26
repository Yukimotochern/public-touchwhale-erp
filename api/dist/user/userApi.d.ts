import { JSONSchemaType } from 'ajv';
import { Identity, Secret, Mongoose, Editable, PlainUser, RolePermissions } from './userTypes';
import { api } from '../api';
export interface SubmitEmail extends Required<Pick<Identity, 'email'>> {
}
export declare const plainUserSchema: JSONSchemaType<PlainUser>;
export declare namespace SignUp {
    type Body = SubmitEmail;
    const API: api<SubmitEmail, any>;
}
export declare namespace Verify {
    interface Body extends Required<Pick<Identity, 'email'>>, Required<Secret> {
    }
    type Data = ReturnType<Mongoose['getSignedJWTToken']>;
    const API: api<Body, string>;
}
export declare namespace SignIn {
    interface Body extends Identity, Required<Secret> {
    }
    const API: api<Body, any>;
}
export declare namespace Update {
    type Body = Editable;
    type Data = PlainUser;
    const API: api<Editable, PlainUser>;
}
export declare namespace GetUser {
    type Data = PlainUser;
    const API: api<any, PlainUser>;
}
export declare namespace GetAvatarUploadUrl {
    interface Data extends Required<Pick<Editable, 'avatar'>> {
        uploadUrl: string;
    }
    const API: api<any, Data>;
}
export declare namespace ChangePassword {
    interface Body {
        currentPassword?: string;
        newPassword: string;
        token?: string;
    }
    const API: api<Body, any>;
}
export declare namespace ForgetPassword {
    interface Body extends SubmitEmail {
    }
    const API: api<Body, any>;
}
export declare namespace ResetPassword {
    interface Body extends Partial<Secret> {
        token: string;
    }
    interface Data {
        token?: string;
    }
    const API: api<Body, Data>;
}
export declare namespace GetWorkers {
    type Data = PlainUser[];
    const API: api<any, Data>;
}
export declare namespace GetWorker {
    interface Data extends PlainUser {
    }
    const API: api<any, Data>;
}
export declare namespace CreateWorker {
    interface Body extends Required<Pick<Identity, 'login_name'>>, Required<Secret>, Required<RolePermissions> {
    }
    interface Data extends PlainUser {
    }
    const API: api<Body, Data>;
}
export declare namespace UpdateWorker {
    interface Body extends Secret, RolePermissions {
    }
    interface Data extends PlainUser {
    }
    const API: api<Body, Data>;
}
export declare namespace DeleteWorker {
    interface Data extends PlainUser {
    }
    const API: api<any, Data>;
}
