## 简单题

1、描述引用计数的工作原理和优缺点。

答：

- 原理：在内部使用一个引用计数器来维护当前对象的引用数，通过判断引用计数器的数值为0的时候，将这个对象视为垃圾对象，从而立即触发GC操作，对这个对象空间进行回收和再利用
- 优点：1、在引用计数器的值为0的时候立即触发GC操作。  2、能够最大化的减少程序暂停
- 缺点：1、对于循环引用的对象不能进行回收。因为对于循环引用的对象，其内部存在互相指引的关系，所以，其引用一直引用计数器无法置为0，无法进行内存回收处理。 2、时间开销大。因为对于每个对象引用值都需要时刻监听并维护，这个过程也需要时间消耗，所以当对象较多的时候，时间消耗也会相应增加。

2、描述标记整理算法的工作流程。

答：

- 标记整理算法是标记清除算法的增强，同样是两次遍历。
- 标记整理算法在第一次遍历所有对象的时候，标记全局可达对象；
- 第二次遍历所有对象的时候先执行整理操作，移动对象位置，使活动对象间地址产生连续，是非活动对象和空闲空间间的地址产生连续；
- 接下来再进行清除操作，回收没有被标记的对象空间，清除掉上一次遍历添加的对象上的标记

3、描述V8中新生代存储区垃圾回收的流程。

答：

- V8中开辟一块内存用于新生代存储内容的使用，然后将这块内存均分为From和To两块区域
- 进行新生代存储时，首先将内容存储在From区域当作活动空间，To区域不存放数据当作空闲空间
- 当GC运行的时候，将From区域的内容进行标记整理操作
- 然后将From的活动对象拷贝到To区域中
- 再将Frome和To两个区域进行空间互换，完成新生代存储内容的空间回收

4、描述增量标记算法在何时使用，及工作原理。

答：

- 增量标记算法在V8的老生代对象的垃圾回收过程中进行使用

- 其工作原理是：
				
	- 在老生代对象开始GC操作的时候，首先会遍历所有第一层可达对象，将其标记
	- 然后停下，使js程序继续运行
	- js程序运行一段时间后，GC操作继续执行，遍历子对象中的可达对象，将其标记
	- 然后再停下，继续执行js代码
	- 由此反复之后，等所有可达对象都做了标记操作后，执行清除操作
	- 完成清楚操作后就回到js代码继续执行它该做的操作


## 代码题1

基于以下代码完成下面的四个练习

    const fp = require('lodash/fp')

    //数据
    //horsepower 马力，dollar_value 价格，in_stock 库存
    const cars = [
        {name: "Ferrari FF", horsepower: 660, dollar_value: 700000, in_stock: true},
        {name: "Spyker c12 Zagato", horsepower: 650, dollar_value: 648000, in_stock: false},
        {name: "Jaguar XKR-S", horsepower: 550, dollar_value: 132000, in_stock: false},
        {name: "Audi R8", horsepower: 525, dollar_value: 114200, in_stock: false},
        {name: "Aston Martin One-77", horsepower: 750, dollar_value: 1850000, in_stock: true},
        {name: "Pagani Huayra", horsepower: 700, dollar_value: 1300000, in_stock: false},
    ]

### 练习1

使用函数组合`fp.flowRight()`重新实现下面这个函数

    let isLastInStock = function (cars) {
        //获取最后一条数据
        let last_car = fp.last(cars)
        //获取最后一条数据的in_stock属性值
        return fp.prop('in_stock', last_car)
    }

答：

`fp.flowRight(fp.prop('in_stock'), fp.last)(cars)`

### 练习2

使用`fp.flowRight()、fp.prop()`和`fp.first()`获取第一个car的name

答：

`fp.flowRight(fp.prop('name'), fp.first)(cars)`

### 练习3

使用帮助函数`_average`重构`averageDollarValue`，使用函数组合的方式实现

    let _average = function (xs) {
        return fp.reduce(fp.add, 0, xs) / xs.length
    } // <- 无须改动

    let averageDollarValue = function (cars) {
        let dollar_values = fp.map(function (cars) {
            return cars.dollar_value
        }, cars)
        return _average(dollar_values)
    }

答：

`let averageDollarValue = fp.flowRight(_average, fp.map(fp.prop('dollar_value')))`

### 练习4

使用`flowRight`写一个`sanitizeNames()`函数，返回一个下划线连接的小写字符串，把数组中的`name`转换为这种形式，例如：`sanitizeNames(["Hello World"])` => `["hello_world"]`

    //无须改动，并在sanitizeNames中使用它
    let _underscore = fp.replace(/\W+/g, '_')

答： 

    function sanitizeNames(cars) {
    	return fp.map(fp.flowRight(_underscore, fp.lowerCase, fp.prop('name')))(cars)
    }

## 代码题2

基于下面提供的代码，完成后续的四个练习

    //support.js
    class Container {
        static of (value) {
            return new Container(value)
        }
        constructor (value) {
            this._value = value
        }
        map (fn) {
            return Container.of(fn(this._value))
        }
    }

    class Maybe {
        static of (x) {
            return new Maybe(x)
        }
        isNothing () {
            return this._value === null || this._value === undefined
        }
        constructor (x) {
            this._value = x
        }
        map (fn) {
            return this.isNothing() ? this : Maybe.of(fn(this._value))
        }
    }

    module.exports = {
        Maybe, Container
    }

### 练习1

使用`fp.add(x, y)`和`fp.map(f, x)`创建一个能让`functor`里的值增加的函数`ex1`

    const fp = require('lodash/fp')
    const {Maybe, Container} = require('./support')

    let maybe = Maybe.of([5, 6, 1])
    let ex1 = // ...你需要实现的位置

答： 

    function a(arr) { 
    	return fp.map(fp.add(1), arr) 
    }
    
    let ex1 = maybe.map(a)

### 练习2

实现一个函数`ex2`，能够使用`fp.first`获取列表的第一个元素

    const fp = require('lodash/fp')
    const {Maybe, Container} = require('./support')

    let xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do'])
    let ex2 = // ...你需要实现的位置

答：

    let ex2 = xs.map(fp.first)

### 练习3

实现一个函数`ex3`，使用`safeProp`和`fp.first`找到`user`的名字和首字母

    const fp = require('lodash/fp')
    const {Maybe, Container} = require('./support')

    let safeProp = fp.curry(function (x, o) {
        return Maybe.of(o[x])
    })
    let user = {id: 2, name: "Albert"}
    let ex3 = // ...你需要实现的位置

答：

    let ex3 = safeProp('name', user).map(fp.first)

### 练习4

使用`Maybe`重写`ex4`，不要有`if`语句

    const fp = require('lodash/fp')
    const {Maybe, Container} = require('./support')

    let ex4 = function (n) {
        if (n) {
            return parseInt(n)
        }
    }

答：

    let ex4 = Maybe.of(parseInt)

## 代码题3

手写实现MyPromise源码

详细代码位于code文件夹下MyPromise.js文件中