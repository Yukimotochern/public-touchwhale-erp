/**
 * A promise that can catch errors with type-safe method.
 */
export declare class ApiPromise<T> extends Promise<T> {
    catched: boolean;
    onErrorsButCancelAndAuth<TF = never>(onrejected: Function, executeWhenAlreadyCatched?: boolean): ApiPromise<T | TF>;
    onErrorsButCancel<TF = never>(onrejected: Function, executeWhenAlreadyCatched?: boolean): ApiPromise<T | TF>;
    onCustomCode<TF = never>(code: number, onrejected: Function, executeWhenAlreadyCatched?: boolean): ApiPromise<T | TF>;
}
export default ApiPromise;
