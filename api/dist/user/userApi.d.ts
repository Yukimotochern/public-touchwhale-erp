import { JSONSchemaType } from 'ajv';
import { Identity, PlainUser } from './userTypes';
import { api } from '../api';
export interface SubmitEmail extends Required<Pick<Identity, 'email'>> {
}
export declare const plainUserSchema: JSONSchemaType<PlainUser>;
export declare namespace SignUp {
    interface Body extends SubmitEmail {
    }
    const signUpApi: api<Body, any>;
    const signUp: (email: string) => Promise<unknown>;
}
