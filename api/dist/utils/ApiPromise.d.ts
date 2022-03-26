export declare class ApiPromise<T> extends Promise<T> {
    catched: boolean;
    constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void);
    onErrorsButCancelAndAuth<TF = never>(onrejected: Function, executeWhenAlreadyCatched?: boolean): ApiPromise<T | TF>;
    onErrorsButCancel<TF = never>(onrejected: Function, executeWhenAlreadyCatched?: boolean): ApiPromise<T | TF>;
    onCustomCode<TF = never>(code: number, onrejected: Function, executeWhenAlreadyCatched?: boolean): ApiPromise<T | TF>;
}
export default ApiPromise;
