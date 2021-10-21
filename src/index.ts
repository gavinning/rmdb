import BaseRMDB from './rmdb'
import { Redis, DataSource } from './types'
export * from './types'

class RMDB {
    private readonly key: string
    private autoUpdateTime: number = 5 * 60
    private expireTime?: number
    static redis: Redis

    constructor(key: string) {
        this.key = key
    }

    /**
     * 单位秒
     * @param autoUpdateTime 数据自动更新时间，默认5分钟
     * @param expireTime 数据过期时间，可选，默认不过期
     * @returns
     */
    keep(autoUpdateTime: number, expireTime?: number) {
        this.autoUpdateTime = autoUpdateTime
        this.expireTime = expireTime
        return this
    }

    from(dataSource: DataSource) {
        return BaseRMDB.init({
            key: this.key,
            redis: RMDB.redis,
            timeout: this.expireTime,
            autoUpdateTime: this.autoUpdateTime,
            dataSource,
        })
    }

    private static init(key: string) {
        return new this(key)
    }

    private static getKey(args: (string | number)[]) {
        return Array.from(args).join(':')
    }

    static src(...args: (string | number)[]) {
        return this.init(this.getKey(args))
    }
}

export function Factory(redis: Redis) {
    RMDB.redis = redis
    return RMDB
}

export type Rmdb = typeof RMDB
export default Factory

// RMDB.src(key).keep(60 * 5).from(() => dataSource())
