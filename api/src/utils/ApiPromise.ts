import axios from 'axios'
import CustomError, { ApiErrorDealtInternallyAndThrown } from './CustomError'
type NullaryFn<T = void> = () => T
type UnaryFn<T = void, U = void> = (arg: T) => U
type OnRejectFn<ErrorAccept = Error> =
  | UnaryFn<ErrorAccept | unknown, never | PromiseLike<never>>
  | undefined
  | null

declare namespace ApiPromise {
  type Executor<T> = (
    resolve: UnaryFn<T | PromiseLike<T>>,
    reject: UnaryFn<Error | unknown>
  ) => void
}

/**
 * A promise that can catch errors with type-safe method.
 */
export class ApiPromise<T> implements Promise<T> {
  promise: Promise<T>
  public constructor(executor: ApiPromise.Executor<T>) {
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
  private getApiErrorDealtInternallyAndThrown(): ApiErrorDealtInternallyAndThrown {
    let apiError: ApiErrorDealtInternallyAndThrown | undefined = undefined
    let err1: any = undefined
    this.catch((err: unknown) => {
      if (err instanceof ApiErrorDealtInternallyAndThrown) {
        apiError = err
      } else {
        err1 = err
      }
      return this.promise.then()
    })
    if (apiError) {
      return apiError
    } else {
      throw new CustomError(
        'Api error is not properly set to ApiPromise as expected.',
        500,
        err1
      )
    }
  }

  public onEveryErrorButCancelAndAuth<TF = never>(
    onrejected: Function
  ): ApiPromise<T | TF> {
    const innerError = this.getApiErrorDealtInternallyAndThrown()
    let thrown = innerError.thrown
    if (
      // cancel
      !(thrown instanceof axios.Cancel) &&
      // unauthorized
      !(axios.isAxiosError(thrown) && thrown.response?.status === 401)
    ) {
      onrejected()
    }
    return this
  }
  public onEveryErrorButCancel<TF = never>(
    onrejected: Function
  ): ApiPromise<T | TF> {
    const innerError = this.getApiErrorDealtInternallyAndThrown()
    let thrown = innerError.thrown
    if (
      // cancel
      !(thrown instanceof axios.Cancel)
    ) {
      onrejected()
    }
    return this
  }
}
export default ApiPromise
