const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
    status = PENDING;
    result = undefined;
    reason = undefined;
    successCallback = [];
    failCallback = [];

    constructor(exector) {
        try {
            exector(this.resolve, this.reject)
        } catch (error) {
            this.reject(e)
        }
    }

    resolve = value => {
        if (this.status !== PENDING) return
        this.status = FULFILLED
        this.result = value
        while (this.successCallback.length) this.successCallback.shift()()
    }
    reject = error => {
        if (this.status !== PENDING) return
        this.status = REJECTED
        this.reason = error
        while (this.failCallback.length) this.failCallback.shift()()
    }
    then = (successCallback, failCallback) => {
        successCallback = successCallback ? successCallback : value => value
        failCallback = failCallback ? failCallback : reason => { throw reason }
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = successCallback(this.result)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(e)
                    }
                }, 0)
            }
            else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(e)
                    }
                }, 0)
            }
            else {
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback && successCallback(this.result)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)
                })
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback && failCallback(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0)
                })
            }
        })

        return promise2
    }

    static all(array) {
        let result = []
        let index = 0

        return new MyPromise((resolve, reject) => {
            function addData(key, value) {
                result[key] = value
                index++
                if (index === array.length) {
                    resolve(result)
                }
            }

            for (let i = 0; i < array.length; i++) {
                let current = array[i];
                if (current instanceof MyPromise) {
                    //promise 对象
                    current.then(value => addData(i, value), reason => reject(reason))
                } else {
                    //普通值
                    addData(i, array[i])
                }
            }
        })
    }

    static resolve(value) {
        if (value instanceof MyPromise) return value
        return new MyPromise(resolve => resolve(value))
    }
    finally(callback) {
        return this.then(value => {
            return MyPromise.resolve(callback()).then(() => value)
        }, reason => {
            return MyPromise.resolve(callback()).then(() => { throw reason })
        })
    }
    catch(failCallback) {
        return this.then(undefined, failCallback)
    }
}

function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (x instanceof MyPromise) {
        //promise 对象
        //x.then(value => resolve(value), reason => reject(reason))
        x.then(resole, reject)
    } else {
        resolve(x)
    }
}

module.exports = MyPromise

























