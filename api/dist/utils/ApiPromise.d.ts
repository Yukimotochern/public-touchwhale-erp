declare type NullaryFn<T = void> = () => T;
declare type UnaryFn<T = void, U = void> = (arg: T) => U;
declare type OnRejectFn<ErrorAccept = Error> = UnaryFn<ErrorAccept | unknown, never | PromiseLike<never>> | undefined | null;
declare namespace ApiPromise {
    type Executor<T> = (resolve: UnaryFn<T | PromiseLike<T>>, reject: UnaryFn<Error | unknown>) => void;
}
/**
 * A promise that can catch errors with type-safe method.
 */
export declare class ApiPromise<T> implements Promise<T> {
    promise: Promise<T>;
    constructor(executor: ApiPromise.Executor<T>);
    get [Symbol.toStringTag](): string;
    then<TS = T, TF = never>(onfulfilled?: UnaryFn<T, TS | PromiseLike<TS>> | undefined | null, onrejected?: OnRejectFn): Promise<TS | TF>;
    catch<TF = never>(onrejected?: OnRejectFn): Promise<T | TF>;
    finally(onfinally?: NullaryFn | undefined | null): Promise<T>;
    private getApiErrorDealtInternallyAndThrown;
    onEveryErrorButCancelAndAuth<TF = never>(onrejected: Function): ApiPromise<T | TF>;
    onEveryErrorButCancel<TF = never>(onrejected: Function): ApiPromise<T | TF>;
}
export default ApiPromise;
