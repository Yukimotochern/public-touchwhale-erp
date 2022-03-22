"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPromise = void 0;
/**
 * A promise that can catch errors with type-safe method.
 */
class ApiPromise {
    constructor(executor) {
        this.promise = new Promise(executor);
    }
    get [Symbol.toStringTag]() {
        return 'ApiPromise';
    }
    then(onfulfilled, onrejected) {
        return this.promise.then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        const clonedPromise = this.promise.then();
        this.promise.catch(onrejected);
        this.promise = clonedPromise;
        return this;
    }
    finally(onfinally) {
        return this.promise.finally(onfinally);
    }
    onMongoError(code, onrejected) {
        this.catch((err) => {
            // if (err instanceof Error) {
            //   console.log(`Error of ${err} is catched: `)
            //   console.error(err)
            //   onrejected()
            // }
            return this.promise.then();
        });
        return this;
    }
}
exports.ApiPromise = ApiPromise;
exports.default = ApiPromise;
