# rmdb
缓存与持久化策略  
优先从Redis缓存读取数据，当缓存过期或为空时，从数据源读取返回并更新到缓存

### Install
```sh
npm i rmdb --save
```

### Usage
```js
const RMDB = reuqire('rmdb')
```
创建rmdb实例
```js
// 默认更新时间 10分钟 缓存不会过期
const rmdb = RMDB.src(key).from(dataSource)


// or
// @key String 必须，Redis Key
// @updateTime Number 可选，更新时间
// @expireTime Number 可选，过期时间，设置该参数，缓存会过期
// @dataSource Function 必须，数据来源
const rmdb = RMDB.src(key).keep(updateTime, expireTime).from(dataSource)


// 推荐
// 缓存本身不会过期，updateTime设置更新时间间隔
// 如果更新失败将会使用缓存输出
const rmdb = RMDB.src(key).keep(updateTime).from(dataSource)
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
```
```js
// 更新数据，参数为空默认从数据源更新
const result = await rmdb.update()
const result = await rmdb.update(data)
```
```js
// 清理缓存
const result = await rmdb.clear()
```

![](http://assets.processon.com/chart_image/5bdc11c0e4b00cdc18c90d9b.png)