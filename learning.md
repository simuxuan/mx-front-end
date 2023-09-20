# 计网

## XSS、CSRF <3>

### XSS

def: 跨站脚本攻击，代码注入攻击

1. 存储型：数据库 + html 拼接
2. 反射型：恶意代码 + 后端操作 html 拼接
3. DOM 型：恶意代码 + 前端手动 html 拼接

**预防** 3

1. 纯前端，不使用服务端渲染。html 拼接充分转义
2. CSP 白名单：内容安全策略。告诉浏览器哪些外部资源可以访问
   （1）meta http-equiv （2）请求头：content-security-policy
3. cookie 安全性：http-only，外部脚本无法获取 cookie

### CSRF

def: 跨站请求伪造
步骤：

1. 用户访问 A 网站
2. 同一个浏览器，另一个 tab 访问网站 B（恶意）
3. 网站 B 诱导|直接访问网站 A，cookie 会被带上。在网站 A 进行恶意操作

分类：

1. img get 请求
2. 表单自动提交 form
3. 诱导用户

**预防**

1. 同源检测：（1）origin ： 来源域名 （2）refer：来源 url
2. 身份验证：CSRF-token。保证是自己的前端网页访问了服务器。
   给前端页面遍历 dom，注入 token，自己的网站发送请求时带上 token
3. cookie：samesite 策略，同站 cookie，cookie 无法被第三方使用

## DDos 攻击 <3>

def：分布式拒绝服务，尝试耗尽引用程序的资源
分类：

1. 容量耗尽攻击：合法流量使网络层不看重负：DNS 放大，伪造受害者 ip，请求大量数据
2. 协议攻击： SYN 攻击 （第二次握手）
3. 资源层攻击：引用程序，sql 注入、跨站脚本等

## 从输入一个 URL 地址到浏览器完成渲染的整个过程 <1>

1. 解析 url。合法：继续 ，不合法：交给搜索引擎
2. 判断缓存：有缓存：走缓存；无缓存：继续
3. DNS 解析：
   递归查询：浏览器 DNS 缓存->操作系统 DNS->本地 DNS 服务器
   迭代查询：根域名服务器->顶级域名服务器->权限域名服务器
4. 封装 http 报文
5. TCP 三次握手
6. 发送请求，收到响应
7. 渲染页面
8. TCP 四次挥手

## GET 和 POST 的区别 <1>

1. get 回退无害，post 重新请求
2. get 书签，历史调用栈 cache
3. get url 编码，post 多种。长度
4. 安全性
5. post 根据浏览器实现：可能两次请求（1）请求头 返回 100 （2）发送请求体

## head 请求 <2>

def：只获取响应头
get 模拟 head：range 设置('Range','bytes=0-0')

## cookie 和 storage 的使用 <2>

不同点：

1. 写入方式
2. 生命周期
3. 大小
4. 使用场景

项目登录流程：
项目为什么用 token？3
使用 cookie 还是 storage？

jwt:直接在服务端解析用户信息。节省了链接数据库的开销

## cookie <3>

def: 浏览器的安装目录下存放着每一个域的 cookie，当请求某个域时，带上这个域名下的 cookie
cookie 一个域 4kb，存放 20 条

格式：document.cookie key，value

属性：

1. expires：cookie 过期时间，不设置表示会话阶段，浏览器关闭 cookie 清除
   max-age: 0 + -
   0: 删除 cookie +；过期时间 expires = max-age + 当前时间 -：会话

2. domain、path
   向某一域名和路径发送 http 请求时，需要携带 cookie

3. secure
   https

4. httpOnly
   js 无法操作（删改查），防止 XSS

设置 cookie:
前端：document.cookie = "key=value;"
后端：响应头：set-cookie 字段: "key=value;"

## 跨域 <3>

def: 跨域是浏览器的策略，实际上请求过去，后端是会处理的，只是返回响应时。浏览器发现响应头里面没有支持跨域响应头 Access-Control-Allow-Origin，所以浏览器将响应拦截了

**限制：**

1. ajax
2. dom 和 js 对象
3. cookie，storage，indexDB

**跨域手段**

1. 修改本地 DNS
2. JSONP
   script 不会跨域，使用 script 请求服务器的 js 脚本，服务将数据返回给函数参数。浏览器拿到脚本会立即执行，就拿到数据了
3. CORS
4. proxy

**CORS 原理：**
是否触发预检：简单和复杂
简单请求：

1. 简单的 methods：get、post、head
2. 常见的请求头
3. content-type 原始 （像 application/json 就不行）

（1）简单请求：
请求：origin（协议+域名+端口号）
响应：
● Access-Control-Allow-Origin：\*
● Access-Control-Allow-Credentials：true --- cookie 相关

如果没有对应响应头，浏览器拦截

（2）复杂请求：
先做一个跨域预检：询问服务器当前域名是否在服务器许可名单内
不满足则在发送请求前就会被拦截
请求：
● Access-Control-Request-Method：接下来会用到的请求方式，比如 PUT
● Access-Control-Request-Headers：会额外用到的头信息
响应头：
除了 Access-Control-Allow-Origin 和 Access-Control-Allow-Credentials 以外，这里又额外多出 3 个头：
● Access-Control-Allow-Methods：允许访问的方式
● Access-Control-Allow-Headers：允许携带的头
● Access-Control-Max-Age：本次许可的有效时长，单位是秒，过期之前的 ajax 请求就无需再次进行预检了

**CORS 跨域和 cookie 的关系**

1. acao：具体的域名，而不是\*
2. acac：true
3. ajax 请求指定 withCredentials 为 true

**proxy 原理**

1. 前端发送请求到和其同源的服务器（代理服务器）
2. 代理服务器转发请求给目标服务器（服务器之间没有同源限制）
3. 服务器返回内容给代理服务器
4. 同源的代理服务器将内容给前端

## 状态码 <1>

204
206
301
401
403
501
503

## 浏览器缓存 <1>

（1）强缓存：

1. 首次请求 200，如果响应 expires、cache-control，强缓存下来
2. 第二次请求，判断过期，过期 200 新资源；200
   expires
   cache-control：public 、 private、no-store、np-cache、max-age
   （2）协商缓存：
   强缓存失效后，去问服务器是否缓存
   Etag，Last-Modified
   if-none-match，if-modified-since

**缓存位置**：内存|硬盘
磁盘：页面资源 html，css,js （缓存策略字段 ETAG 等）
内存：更快，容量小，存储比较的资源。浏览器关闭|手段清除缓存后就会消失

**缓存方案：**
强缓存+协商缓存
html 协商缓存
js、css、图片 强缓存

## http content-type <1>

content-Type 和 Accept 有什么区别呢？

# 浏览器相关

## EventLoop <3>

**任务：**
宏任务：setTimeout、raf、I\O、setImmediate
微任务：process.nextTick、promise、MutationObserver

**步骤：**

1. 先同步、再异步，先宏再微
2. 一定是先把任务全部加入队列，再取出执行

相关题

1. promise 内都是同步，遇见 resolve 放入队列
2. await 等待普通值|普通函数，直接同步执行 ； 等待是一个 promise|等待的函数里有 promise，等待 resolve，然后拿到等待表达式的结果|resolve 的结果

## 渲染流程 <1>

浏览器渲染原理：双缓冲
步骤：cssom，dom --> layout -->paint -->composite

## 回流重绘 <2>

回流：4

1. width、height、padding、margin、left
2. dom 节点增删
3. offset、scroll、client
4. window.resize , window.getComputedStyle

重绘：
color、visiblelity

**如何减少回流和重绘**

1. DOM 操作：doucumentFrament
2. 不使用 table 布局
3. translate 代替 top
4. dom 多个读放一起，不要穿插写
5. requestAnimationFrame

## 浏览器的解析和渲染的阻塞情况 <1>

js 阻碍浏览器的解析和渲染：由于浏览器要获取最新的样式（js 可能操作样式）。

1. 对于不操作样式的 js，可以 defer|async 异步加载

css 阻碍渲染：
遇见 script 会重新渲染，让 js 拿到最新的样式，如果此时 css 没有加载完成，就会阻碍渲染

## defer 和 async <1>

defer：不阻碍解析，异步加载，html 解析完后，DOMContentLoaded 前执行
async：异步加载后，立即执行

模块化默认采用 defer

## onload 和 DOMContentLoaded <2>

onload：html、css、js 都加载完成 this.readyState = interactive
DOMContentLoaded ：只 html 解析完毕 this.readyState = complete

## 浏览器线程和进程 <1>

(1)进程：cpu 分配内存

1. 浏览器进程
2. 渲染进程
3. GPU 进程
4. 网络进程
5. 插件进程

(2)线程：cpu 调度最小单位
渲染进程

1. GUI 渲染
2. JS 引擎
3. 事件触发线程
4. 定时器
5. 异步 hhtp

# JS

## JS 基础

### 栈和堆 <2>

栈：自动分配释放，速度快，容量小
堆：开发者手动分配释放，速度慢，容量大

### 类型检测 <2>

1. typeof : 数组、null、对象 ---> object ； NaN---> number
2. a instanceof b: 引用
3. constructor
4. Object.prototype.toString.call()：内部属性 [object Object|Number]
   xxx.toString(): array，function，str 重写了该方法 ---> 字符串

- 原理：若参数不为 null 和 undefiend，转为包装类型
  可以通过 obj[Symbol.toStringTag]方法修改 [object xxx] xxx 的值

### null 和 undefined 的区别 <2>

不同：含义；undefined == null,undefined === null
void 0

### NaN <3>

def:非数字 NaN !== NaN
**isNaN 和 Number.isNaN:**
isNaN:先将传入的数据转为数字
Number.isNaN:直接判断是否为 NaN

### 类型转换 <3>

显示转换：Number、toString
隐式转换：+、-、\*、/ 、 == 、 >
**ToPrimitive 方法：**

1. toString: 返回字符串
2. valueOf: 返回当前对象原始值（基本数据类型值），基本原封不动

- 特殊： fun = () => {} : [Function:fun] ; new Date() : 18923231

* valueOf 和 toString 都定义在 Object.prototype 上

ToPrimitive 方法： a.valueOf().toString()

1. 对于对象先转换为基本类型
2. 判断两个基本类型类型是否相同
3. 相同进行判断；不同根据符号进行转换
4. 转换后进行判断

### JavaScript 中的包装类型 <3>

js 后台会将其隐式转换为对象
**转换：**
object --> 基本类型 ：valueOf
基本类型 --> object ：toString

- new 基本类型出来的是一个包装类型对象

## DOM

### 事件机制 <1>

捕获阶段（默认不触发） + 目标阶段 + 冒泡阶段（默认触发事件）
事件默认绑定在冒泡阶段：addEventListner(()=>{},true) ---> 捕获

**事件代理**

1. 减少内存和 dom 操作
2. 动态绑定，新增子元素也可

### document.write 和 innerHTML <3>

1. document.write : 影响整个文档流。文档加载时直接加入内容，加载结束后调用会覆盖整个文档
2. innerHTML：某个 dom 的元素内容

### scroll，offset，client <3>

offset：元素距离带定位的父元素的距离：offsetTop。padding+border+content：offsetWidth
client：当前元素边框和内容大小。边框 clientTop，内容（padding+content） clientWidth
scroll：滚动的距离。scrollWidth （padding+content）

**window**
var w=window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

## BOM

## JS 常见概念

### 原型链 <1>

总结：

1. **proto**最终指向 Object.prototype
2. 构造函数**proto** 指向 Function.prototype （普通构造+Function+Object）
3. Function 的显式和隐式原型都指向 Function.prototype

**获取非原型链上的属性：**
hasOwnProperty
**引用场景**
a.prototype.name = '123'

### 作用域链 <2>

全局、函数、块级
变量访问使用

- 一般只有函数声明一个作用域
- 块级只影响定义变量的那一块，让变量不会提升

### 执行上下文 <2>

全局上下文：js 解析代码，先创建一个全局上下文环境（变量声明，函数申明）
函数上下文：（变量定义，函数声明，this，arguments）
eval 有自己的上下文

函数提升 > 变量提升

执行上下文栈：JavaScript 引擎使用执行上下文栈来管理执行上下文

### 闭包 <3>

def:可以访问另一个函数作用域中的变量的函数

场景：

1. 功能函数：防抖
2. 对象中私有变量

循环闭包解决问题:

1. 立即函数
2. let

### JS 严格模式 <3>

1. with 语句
2. eval，arguments.call
3. this 指向全局
4. 对象重名属性
5. 变量必须先定义再使用

### ==、===、Object.is<2>

==： 强制类型转换
===: 不转化
Object.is: 不转化，+0 -0 \ === 与 ==

### 数据类型大小限制 <3>

字符串：2 ^ 53 - 1
数字：2 ^ 1024 Number.MAX_VALUE

- 整数 : - 2 ^ 53 - 1 ~ + 2 ^ 53 - 1 Number.MAX_SAFE_INTERGER Infinty

### 字符串方法 <2>

str.charCodeAt(0) 字符串 --> ascii
String.fromCharCode(65) ascii --> 字符串

str.indexOf()
str.concat()
str.substr(2,2)
str.substring(2,4)
str.replace()
str.split()
str.match()
str.search()
str.slice(i,j)

不改变原来字符串

### 数组方法汇总 原生方法 + es6 <3>

forEach 、sort 、reverse 、 splice() 改变原数组
forEach: 引用类型
reduce：arr.reduce((pre,item,index,array)) pre 上一次调用 callbackFn 的返回值

1. 如果指定了初始值：pre 就是初始值，item 为数组第一个元素
2. 如果没有指定初始值：pre 是第一个元素，item 是第二个元素
3. 如果数组为空且未指定初始值-->报错
4. 不满足初始迭代条件，会不执行回调

### this <2>

this 严格模式下不会指向全局
node 中全局 this ---> undefiend

### 构造函数、类、继承 <3>

**new 步骤：4**

1. 创建一个对象
2. 对象.**proto** = 构造函数.property
3. 对象调用构造函数 Function.apply(newObj,arguments)
4. 根据构造函数的返回值：引用类型返回它；否则返回新对象

**类和构造函数**
类：直接写（a = '111'）相当于 this 上的属性，a() 相当于原型上属性，static 是静态属性
构造函数：直接写：静态属性 ， this.name = '111'才是实例的属性

**类继承**

```js
function Animal(age) {
  this.age = age;
  this.name = "sss";
}
Animal.prototype.a = function () {
  console.log(111);
};
function Dog(age) {
  Animal.call(this, age);
  this.sex = "123";
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
```

### for in for of <3>

for in 缺点：

1. 性能：只能遍历出当前对象和其原型链上的可枚举属性
2. 遍历顺序：先遍历非负整数从小到大；剩下的根据创建顺序
3. 无法遍历 symbol

### true 和 truthy <1>

### 进制转换 <2>

number.toString(16)
parseInt("10",8)

### JSON 序列化 <3>

JSON.stringify(value,replacer,space)
value：序列化的对象
replacer：函数（所有属性都会经过函数处理）| 数组（数组内的会经过处理）| null（所有的都会被处理）
space： 指定缩进用的空白字符串

- 如果一个序列化对象拥有 toJson 方法，那么该 toJson 覆盖序列化方法，是 toJson 返回值会被序列化

**JSON 序列化，哪些不可序列化**

1. symbol
2. undefined
3. function () {}
4. get f() {}
5. 循环引用序列化时会报错

**图片序列化**

1. base64 编码后 toDataURL
2. 放进 JSON 对象传输

**JSON.parse(text,recevier)**
recevier 修改解析生成的原始值

## ES5

### Object.defineproperty <3>

configureable: 可配置 delete
enumerable: 可枚举
value: 默认值 undefined
writable：可写
get：默认值 undefined
set：默认值 undefined

**注意点**

1. Object.defineProperty()定义的属性：enumerable，configurable，writable 这几个值默认为 false
2. 直接为对象动态添加属性，enumerable，configurable，writable 这几个值默认为 true

**可枚举**

1. 基本的包装类型上的原型属性都是不可枚举的;Object, Array, Number
2. 相关方法：
   Object.getOwnPropertyNames()：获取出来看 symbol 之外所有属性（可枚举+不可枚举）
   Object.keys()、Object.values()、Object.entries()： 获取可枚举属性
   for...in：自身和原型链上的可枚举属性
   Object.getOwnPropertySymbols()：获取 symbol 属性
   obj.propertyIsEnumerable()：是否可枚举
   Reflect.ownKeys()：= Object.getOwnPropertyNames() + Object.getOwnPropertySymbols()

### JS 函数的 name 属性 <1>

### Object.freeze <3>

freeze：对象不可添加、不可配置（删除）、不可修改
seal：对象不可添加、不可配置，但可以修改

- 冻结|封闭对象，不会影响对象的原型链

### sort <3>

**基本使用：**
（1）对于 arr1.sort()
普通数组：根据 unicode 码点排序
Unit16Array 数组：根据数字大小排序
（2）arr1.sort((a, b) => a - b) 数字大小

**js 的 sort**
n < 10 : 插入排序
n > 10 : 快速排序

### Math <1>

Math.max(序列)

## ES6

### 类 <1>

this.xxx 实例上
a = xxx 实力上
static xxx 类本身
fn() {} 类.prototype

### let const var <1>

### 箭头函数 <2>

特点：

1. this 不会被改变指向。cal、apply、bind
2. 没有自己的 this
3. 不能作为构造函数
4. 没有 arguments，prototype
5. 不能作为生成器

**箭头函数如何改变其 this 指向**
父级包裹，this 作为参数传递给箭头函数

### 模板字符串 <1>

标签模板字符串：foo`my  name is ${name}` foo(['my name is '],'simuxuan')

### 进制和长数字 <2>

进制转换：10->16 num.tostring(16) ; 16->10 paserInt('ff',16)
长数字表示 100_00

### 字符串存在性判定 <2>

ES5：str.indexOf('x')
ES6：str.includes('x') startsWith endsWith

### 对象 Object 相关方法 <2>

Object.keys() Object.values()
Object.entries(obj) obj -->二维数组
Object.fromEntries()

const params = new URLSearchParams(searchStr),params.get("name"),Object.fromEntries(params)

### set <3>

add delete clear has forEach for of
weakset:

1. weakset 只能存放对象类型；weakset 中的对象不能遍历，不能获取
2. set 存放对象是强引用，weakset 是弱引用。当里面对象置 null 时，weakset 会被 GC 回收
   作用：对存储的对象的集合进行弱引用管理，检测内存泄露

### map <3>

set delete forEach clear for of 可以使用对象作为键
weakMap:

1. 只能使用对象作为 key；weakmap 不能遍历
2. 弱引用，同 weakset

**map 和 obj 区别？**

1. key 区别： obj：key：字符串|Symbol；map：任何类型
2. 遍历顺序：obj 顺序不确定；map 和插入顺序相同，可以实现 LRU

### 字符串填充方法 <2>

"6".padStart(3,"\*") ---> \*\*6
padEnd

### flat 和 flatMap <2>

flat: nums.flat(2)
flatMap: 先 map 再 flat

### trim <2>

trim 删除前后空格
trimStart
trimEnd

### BigInt <2>

表示大数，尾部+n ：9007199254740992n

### 空值合并运算符 <3>

取代||中对空值的判断

const res = a ?? b
如果 a 为 null|undefined,返回 b；否则返回 a （只对空值判断）

### promise <3>

def：三个状态
**resolve 和 reject：**

1. 传递的参数非 promise：resolve---fullfilled ， reject---rejected
2. 传递参数为 promise：resolve、reject---状态为参数 promise 的状态
3. 传递的参数为具体 then 方法的对象，会将其视为 promise 对象，并调用其 then 方法

```js
let thenable = {
  then: function (resolve, reject) {
    reject(1);
  },
};
let p = new Promise((resolve, reject) => {
  resolve(thenable);
});
```

**then**
then(value)
**catch**
catch(err)
**all**
数组的每一项都是一个 promise 对象。当数组中所有的 promise 的状态都达到 resolved 的时候
**race**
当要做一件事，超过多长时间就不做了
**finally**
finally() 没有参数：finally 方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果
不管 Promise 对象最后状态如何，都会执行的操作

### async await <3>

（1）async
声明一个异步函数，返回值为 promise
返回值如果不是 promise，封装为 promise
（2）await
等待的是一个值：表达式结果就是值
等待的是一个 promise：表达式结果是 promise 成功的结果
等待的是一个普通函数（返回值不为 promise，且中途不存在 await 在等待 promise）：直接执行
等待的是一个带有 promise 的函数（含有|返回值）：阻碍 await 所在作用域的后面的代码

- 注意阻碍的是 await 作用域的 await 后面的代码

**相比于 promise 的优势：**

1. promise 虽然解决了回调地狱，但是阅读不如 async
2. 更好的错误捕获：try catch 轻松捕获
3. 更好的调试：链式不便于调试

### Symbol <2>

不可枚举属性：for in | Object.keys | getOwnPropertyNames | JSON.stringify
**api** ：
Symbol.for()

### proxy 和 reflect <3>

**proxy**

```js
const proxy = new Proxy(obj, {
  // 目标对象、键、值、原始操作所针对的对象
  set: function (target, key, newvalue, recevier) {},
  get: function (target, key, recevier) {},
  deleteProperty: function (target, key) {},
  has: function (target, key) {},
  apply: function () {},
  construct: function () {},
});
```

**reflect**: 代替 Object

## GC <3>

**def**:
js 代码运行，需要分配内存给变量和值，当变量不再参与时，就需要系统回收被占用的内存空间

- 全局变量生命周期持续到页面卸载，局部变量从函数执行开始到执行结束

**垃圾回收的方式**
（1）标记清除
标记阶段：遍历根对象，递归标记活动对象。未被标记的对象标记为未活动对象。
垃圾回收器知道哪些变量需要删除
清除阶段：清除所有未被标记的对象，释放内存空间
优点：解决循环引用
缺点：内存碎片化--->优化算法

（2）引用计数
跟踪记录每个值被引用的次数，次数为 0 删除
缺点：循环引用

**如何减少垃圾回收？**
数组： arr.length = 0
对象： obj = null
函数： 可以复用的

**内存泄露，内存溢出**
用不到的变量，依然占据的内存空间。一直堆积导致内存溢出

**哪些情况会导致内存泄漏**

1. 意外的全局变量
2. 被遗忘的计时器|回调函数
3. 脱离 dom 的引用
4. 不合理闭包

# react

## redux

### JS 纯函数 <3>

**def**

1. 输入不会被改变
2. 输出只由输入决定
3. 函数执行不影响函数体外的变量

**作用**
确定的输入，一定产生确定的输出

**场景**

1. 组件为纯函数（props 不被改变）
2. redux 的 reducer

### redux 基本使用

#### redux 三大原则 <3>

1. 单一数据源（一个 store）
2. state 只读（action 修改）
3. 纯函数 reducer

#### 组成 <3>

1. store：存储状态，状态初始值在 redcuer
2. reducer：一个函数，接收之前的状态和 action
3. action：一个对象，通常 def 为函数 type payload
4. dispatch：派发 action
5. selector：一个函数，state 入参，封装 state 中某个数据的方法

- 详细
  **store**
  store 对象
  **reducer** (preState,action) => newState

1. 禁止直接修改 state，需要复制
2. 禁止异步逻辑、副作用代码
3. reducer 来源于 reduce 的构想： actions.reduce(reducer,initialState)

**action**：{type:'home/addList',payload:'xxx'}
actionCreator: addList = text => {type:'home/addList',payload:text}

1. action 需要包含唯一 id，和其他一些随机值。不要讲随机值放入 reducer 中
2. action 和 state 应该只包含普通 js（可序列化的值）。不要放入类、函数
3. action 对象只包含描述事件类型的最小信息

**dispatch**
更新 state 的唯一办法：store.dispatch

**selector**
从 store 中提取指定片段

1. 复用逻辑：应用程序不同部分读取相同的数据
2. 编写选择器需要维护更多的代码，需要复用时再进行添加

- reselect

1. 缓存和避免重复计算：store 中数据发生变化时，reselect 会检查输入参数是否变化，没变化返回缓存结果。store 数据变化，reselect 只会重新计算受影响部分
2. 复用：计算逻辑封装

### react-redux <3>
解决不便：
1. 需要在App里订阅监听数据的变化 或者 在每个组件监听store数据的变化
2. 每个组件获取store里的数据，都需要引入store

提供provider、connect函数
1. provider在app传入store，解耦每次导入store
2. connect封装传入数据，自动监听

### redux 原理：<2>
初始阶段：
1. 使用顶层root reducer创建redux store
2. store调用一次root redcuer，讲返回值保存为state
3. 视图首次渲染，去state拿数据；并监听store的更新

更新阶段：
1. dispatch一个action修改状态
2. redcuer执行更新state
3. store通知所有订阅过的视图，store更新
4. 视图组件，检查需要的state部分是否更新
5. 更新视图

### combineRedcuers <1>

### connect函数 <1>

### 中间件 <3>


# Node
## 前端模块化开发
### esm和cjs总结 <3>
**使用注意**
1. 默认.js都是cjs
2. .cjs强制识别为cjs ,.mjs识别为esm
3. package.json 中 type="commonjs" | type="module"

**区别：**
esm:
1. 使用方式 module.exports  ，export export defalut
2. esm是输出值的引用，cjs是值的拷贝（拷贝了数值|引用地址）
3. cjs输出动态（运行时加载），esm输出静态(编译时确定依赖关系)
4. cjs同步，esm异步

cjs:
