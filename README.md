# rmdb
缓存与持久化策略  
优先从Redis缓存读取数据，当缓存过期或为空时，从数据源读取返回并更新到缓存

### Install
```sh
npm i rmdb
yarn add rmdb
```

### Usage
```js
// 推荐使用 ioredis
// 依赖支持Promise的Redis实例
const { Factory } = reuqire('rmdb')
const RMDB = Factory(redis)
```
```js
// 使用ES6
import Factory from 'rmdb'
const RMDB = factory(redis)
```

创建rmdb实例
```js
// 默认更新时间 5分钟 缓存不会过期
const rmdb = RMDB.src(key).from(dataSource)

/**
 * @param {string} key              必须，Redis Key
 * @param {number} autoUpdateTime   数据自动更新时间，默认5分钟
 * @param {number?} expireTime      数据过期时间，可选，默认不过期
 * @param {DataSource} dataSource   必须，数据来源
 * @returns {RMDB}
 */
const rmdb = RMDB.src(key).keep(autoUpdateTime, expireTime).from(dataSource)


// 对于配置类型的存储，推荐不设置expireTime时间
// 缓存本身不会过期，autoUpdateTime设置更新时间间隔
// 如果更新失败将会使用缓存输出
const rmdb = RMDB.src(key).keep(autoUpdateTime).from(dataSource)
```

#### Types
```ts
export type DataSource = (...args: any[]) => any | Promise<any>
```


#### Example 1
```js
// 每10分钟自动从数据源更新数据到缓存
const rmdb = RMDB.src('test:f1').from(() => [1,2,3])
```

#### Example 2
```js
// 每小时自动从数据源更新数据到缓存
const rmdb = RMDB.src('test:f1').keep(3600).from(() => [1,2,3])
```

#### Example 3
```js
// 每小时自动从数据源更新数据到缓存
// 数据24小时过期，数据过期后再次请求将触发数据更新
const rmdb = RMDB.src('test:f1').keep(3600, 3600*24).from(() => [1,2,3])
```

### rmdb
rmdb实例提供3个方法
```js
// 查询数据
const data = await rmdb.get()
// 过滤条件
// 所有参数会被当做过滤条件透传给dataSource
// 过滤条件属于高级用法，多数时候不需要，谨慎使用
const data = await rmdb.get({ id: 1 })
```
```js
// 更新数据，参数为空默认从数据源更新
const result = await rmdb.update()
// 过滤条件
// 所有参数会被当做过滤条件透传给dataSource
// 过滤条件属于高级用法，多数时候不需要，谨慎使用
const result = await rmdb.update({ id: 1 })
```
```js
// 清理缓存
const result = await rmdb.clear()
```

![](http://assets.processon.com/chart_image/5bdc11c0e4b00cdc18c90d9b.png)