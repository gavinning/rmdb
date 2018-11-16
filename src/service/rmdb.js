const is = require('aimee-is')
const debug = require('../lib/debug')
const config = require('../config/timeout')

const updateRedis = Symbol('updateRedis')
const getFromRedis = Symbol('getFromRedis')

class RMDB {
    constructor({key, query, redis, mysql, timeout, timeoutType}) {
        this.redis = redis
        this.mysql = mysql
        this.queryMysql = () => {}

        this.options = { key }
        this.options.timeout = timeout || config.default.value
        this.options.timeoutType = config.isVaildType(timeoutType) ? timeoutType : config.default.type
        
        // 支持sql语句直接查询
        if (is.string(query)) {
            this.queryMysql = (...args) => this.mysql.query(query, [...args])
        }
        // 支持自定义查询，返回Promise
        if (is.function(query)) {
            this.queryMysql = query
        }
    }

    key(key) {
        this.options.key = key
        return this
    }

    async get() {
        // Step 1
        // 检查Redis
        // 若存在则直接返回
        let data = await this[getFromRedis]()
        if (data) {
            debug.log('data from redis by', this.options.key)
            try {
                return JSON.parse(data)
            }
            catch(err) {
                return data
            }
        }

        // Step 2
        // 无缓存则从Mysql读取数据
        data = await this.getFromMysql(...arguments)

        // Step 3
        // 更新数据到Redis
        // 允许失败，失败则下一次继续从Mysql读取
        this[updateRedis](data)

        // Step 4
        // 返回数据
        debug.log('data from mysql by', this.options.key)
        return data
    }

    async update() {
        await this.updateMysql(...arguments)
        return await this[updateRedis]()
    }

    async [getFromRedis]() {
        return this.redis.get(this.options.key)
    }

    async [updateRedis](data) {
        if ([null, undefined].includes(data)) {
            data = await this.getFromMysql()
        }
        data = is.string(data) ? data : JSON.stringify(data)
        return this.redis.set(this.options.key, data, this.options.timeoutType, this.options.timeout)
    }

    // 子类必须实现该方法
    async getFromMysql() {
        return this.queryMysql(...arguments)
    }

    // 子类可选实现该方法
    async updateMysql() {}
}

module.exports = RMDB
