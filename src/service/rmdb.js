const is = require('aimee-is')
const { Increment } = require('god-redis-kit')()
const debug = require('../lib/debug')
const updateRedis = Symbol('updateRedis')
const getFromRedis = Symbol('getFromRedis')
const isNeedUpdate = Symbol('isNeedUpdate')

class BaseRMDB {
    constructor({key, timeout, dataSource, updateSign, redis}) {
        this.key = key
        this.redis = redis
        this.timeout = timeout
        this.updateSign = updateSign
        this.dataSource = dataSource || (() => {})

        Increment.redis = redis

        if (!is.function(dataSource)) {
            throw new Error('RMDB: dataSource must be a function')
        }
    }

    async get() {
        // Step 1
        // 检查Redis
        // 若存在则直接返回
        let data = await this[getFromRedis]()
        if (data) {
            debug.log('data from redis by', this.key)
            try {
                // 检查是否需要更新
                this[isNeedUpdate]()
                return JSON.parse(data)
            }
            catch(err) {
                return data
            }
        }

        // Step 2
        // 无缓存则从Mysql读取数据
        data = await this.dataSource(...arguments)

        // Step 3
        // 更新数据到Redis
        // 允许失败，失败则下一次继续从数据源读取
        this[updateRedis](data)

        // Step 4
        // 返回数据
        debug.log('data from dataSource by', this.key)
        return data
    }

    async update() {
        return this[updateRedis](...arguments)
    }

    async clear() {
        await this.redis.del(this.key)
        await this.redis.del(this.updateSign.key)
    }

    async [isNeedUpdate]() {
        const isRepeat = await Increment.create(this.updateSign.key).isRepeat()
        
        // 检查重复更新
        if (isRepeat) {
            return false
        }

        try {
            await this[updateRedis]()
        }
        catch(err) {
            debug.error(`key:${this.key} update failure`)
            this.redis.expire(this.updateSign.key, 1)
        }
    }

    async [getFromRedis]() {
        return this.redis.get(this.key)
    }

    async [updateRedis](data, ...args) {
        if ([null, undefined].includes(data)) {
            data = await this.dataSource(...args)
        }
        data = is.string(data) ? data : JSON.stringify(data)
        return !this.timeout ?
            this.redis.set(this.key, data):
            this.redis.set(this.key, data, 'EX', this.timeout)
    }

    static init() {
        return new this(...arguments)
    }
}

module.exports = BaseRMDB
