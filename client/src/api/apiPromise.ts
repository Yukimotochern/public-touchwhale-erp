import { mongo } from 'mongoose'

type NullaryFn<T = void> = () => T
export type UnaryFn<T = void, U = void> = (arg: T) => U
export type OnRejectFn<ErrorAccept = Error> =
  | UnaryFn<ErrorAccept | unknown, never | PromiseLike<never>>
  | undefined
  | null

declare namespace ApiPromise {
  type Executor<T> = (
    resolve: UnaryFn<T | PromiseLike<T>>,
    reject: UnaryFn<Error | unknown>
  ) => void
}

// typed error handling types
// type OnMongoError = (cb: Function = ()=>{}, error: )=>{

// }

/**
 * A promise that can catch errors with type-safe method.
 */
export class ApiPromise<T> implements Promise<T> {
  promise: Promise<T>
  public constructor(executor: ApiPromise.Executor<T>) {
    // super(executor)
    this.promise = new Promise(executor)
  }
  public get [Symbol.toStringTag](): string {
    return 'ApiPromise'
  }
  public then<TS = T, TF = never>(
    onfulfilled?: UnaryFn<T, TS | PromiseLike<TS>> | undefined | null,
    onrejected?: OnRejectFn
  ): Promise<TS | TF> {
    return this.promise.then(onfulfilled, onrejected)
  }
  public catch<TF = never>(onrejected?: OnRejectFn): Promise<T | TF> {
    const clonedPromise = this.promise.then()
    this.promise.catch(onrejected)
    this.promise = clonedPromise
    return this
  }
  public finally(onfinally?: NullaryFn | undefined | null): Promise<T> {
    return this.promise.finally(onfinally)
  }
  //
  public onMongoError<TF = never>(onrejected?: OnRejectFn): ApiPromise<T | TF> {
    this.catch()
    return this
  }
}
