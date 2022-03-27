import axios from 'axios'
import CustomError, { ApiErrorDealtInternallyAndThrown } from './CustomError'

/**
 * A promise that can catch errors with type-safe method.
 */
Promise
export class ApiPromise<T> extends Promise<T> {
  catched: boolean = false
  public onErrorsButCancelAndAuth<TF = never>(
    onrejected: Function,
    executeWhenAlreadyCatched: boolean = false
  ): ApiPromise<T | TF> {
    this.catch((err: any) => {
      if (
        err instanceof ApiErrorDealtInternallyAndThrown &&
        (!this.catched || executeWhenAlreadyCatched)
      ) {
        const thrown = err.thrown
        if (
          // cancel
          !(thrown instanceof axios.Cancel) &&
          // unauthorized
          !(axios.isAxiosError(thrown) && thrown.response?.status === 401)
        ) {
          onrejected()
          this.catched = true
        }
      }
    })
    return this
  }

  public onErrorsButCancel<TF = never>(
    onrejected: Function,
    executeWhenAlreadyCatched: boolean = false
  ): ApiPromise<T | TF> {
    this.catch((err: any) => {
      if (
        err instanceof ApiErrorDealtInternallyAndThrown &&
        (!this.catched || executeWhenAlreadyCatched)
      ) {
        const thrown = err.thrown
        if (
          // cancel
          !(thrown instanceof axios.Cancel)
        ) {
          onrejected()
          this.catched = true
        }
      }
    })
    return this
  }

  public onCustomCode<TF = never>(
    code: number,
    onrejected: Function,
    executeWhenAlreadyCatched: boolean = false
  ): ApiPromise<T | TF> {
    this.catch((err: any) => {
      if (
        err instanceof ApiErrorDealtInternallyAndThrown &&
        (!this.catched || executeWhenAlreadyCatched)
      ) {
        const custom = err.customError
        if (custom && custom.statusCode === code) {
          onrejected()
          this.catched = true
        }
      }
    })
    return this
  }
}
export default ApiPromise
