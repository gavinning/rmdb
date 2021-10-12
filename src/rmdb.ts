import { log, error } from './debug'
import { RMDBOptions } from './types'
import { Increment } from '@4a/rediskit'

export default class RMDB {
    private readonly updateKey: string
    private readonly key: RMDBOptions['key']
    private readonly redis: RMDBOptions['redis']
    private readonly timeout: RMDBOptions['timeout']
    private readonly autoUpdateTime: RMDBOptions['autoUpdateTime']
    private readonly dataSource: RMDBOptions['dataSource']
    private readonly updateIncrement: Increment

    constructor({ key, redis, timeout, autoUpdateTime, dataSource }: RMDBOptions) {
        this.key = key
        this.redis = redis
        this.timeout = timeout
        this.autoUpdateTime = autoUpdateTime
        this.dataSource = dataSource
        this.updateKey = [key, 'update'].join(':')
        this.updateIncrement = Increment.init({ key: this.updateKey, redis: this.redis })
    }

    async get(...args: any[]) {
        // 检查是否需要更新
        await this.isNeedUpdate()

        // 检查Redis
        // 若存在则直接返回
        let data = await this.getFromRedis()
        if (data) {
            log('[RMDB]data from redis by:', this.key)
            try {
                return JSON.parse(data)
            } catch (err) {
                return data
            }
        }

        // 缓存查询失败
        // 更新数据到Redis
        // 允许失败，失败则下一次继续从数据源读取
        data = await this.update(...args)

        // 返回数据
        log('[RMDB]data from dataSource by:', this.key)
        return data
    }

    async update(...args: any[]) {
        const data = await this.dataSource(...args)
        const source = this.isString(data) ? data : JSON.stringify(data)
        !this.timeout
            ? this.redis.set(this.key, source)
            : this.redis.set(this.key, source, 'EX', this.timeout)
        return data
    }

    async clear() {
        await this.redis.del(this.key)
        await this.redis.del(this.updateKey)
    }

    private isString(obj: any) {
        return 'string' === typeof obj
    }

    private async isNeedUpdate() {
        const isRepeat = await this.updateIncrement.isRepeat()

        // 检查重复更新
        if (isRepeat) {
            return
        }

        try {
            await this.update()
            // 重要：设置更新标记过期时间
            await this.redis.expire(this.updateKey, this.autoUpdateTime)
        } catch (err) {
            console.error(`[RMDB]Error: key:${this.key} update fail`, (<any>err).message)
            error(`[RMDB]Error: key:${this.key} update fail`, err)
            this.redis.expire(this.updateKey, 0)
        }
    }

    private async getFromRedis() {
        return this.redis.get(this.key)
    }

    static init(opt: RMDBOptions) {
        return new this(opt)
    }
}
