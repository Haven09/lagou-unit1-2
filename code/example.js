MyPromise = require('./MyPromise')

//测试用代码
let a = new MyPromise((resolve, reject) => {
    // return resolve(100)
    // return reject('failed')
    setTimeout(() => {
        return resolve('1s later...')
    }, 1000)
})
let b = new MyPromise((resolve, reject) => {
    // return resolve(100)
    // return reject('failed')
    setTimeout(() => {
        return resolve('3s later...')
    }, 3000)
})
let c = new MyPromise((resolve, reject) => {
    // return resolve(100)
    // return reject('failed')
    setTimeout(() => {
        return resolve('2s later...')
    }, 2000)
})

// console.log(a);

// a.then(res => {
//     console.log(res);
//     return 'aaa'
// }, err => {
//     console.error(err);
// }).then(value => {
//     console.log(value);
// })

// MyPromise.all(['a', 'b', a, b, c]).then(res => {
//     console.log(res);
// })

// MyPromise.resolve('123').then(res => {
//     console.log(res);
// })

// console.log(); 