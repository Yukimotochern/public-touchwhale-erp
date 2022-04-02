import Ajv, { ErrorObject } from 'ajv';
import CustomError from './CustomError';
export declare const ajv: Ajv;
declare const avjErrorWrapper: (err: ErrorObject<string, Record<string, any>, unknown>[] | null | undefined) => CustomError;
export { avjErrorWrapper };
export default ajv;
