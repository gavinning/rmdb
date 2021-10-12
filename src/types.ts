import { Redis } from 'ioredis'
export { Redis } from 'ioredis'

export type DataSource = (...args: any[]) => any | Promise<any>

export interface RMDBOptions {
    key: string
    timeout?: number
    autoUpdateTime: number
    dataSource: DataSource
    redis: Redis
}
