import Base from '../dist'
import Redis from 'ioredis'
import { deepEqual, notDeepEqual } from 'assert'

const redis = new Redis()
const RMDB = Base(redis)

describe('RMDB Class test', () => {
    function sleep(time: number) {
        return new Promise(res => {
            setTimeout(res, time)
        })
    }

    // 检查核心功能
    it('test base', async () => {
        const arr = [1, 2, 3]
        const rmdb = RMDB.src('test:f1').from(() => arr)
        const data = await rmdb.get()
        deepEqual(arr, data)
        rmdb.clear()
    })

    // 检查过滤条件传递
    it('test filters', async () => {
        const a = { id: 1, age: 21 }
        const b = { id: 2, age: 22 }
        const c = { id: 3, age: 23 }

        type User = typeof a

        function getPosts(user: User) {
            return { id: user.id, title: 'post' }
        }

        function getPostsHandler(user: User) {
            return RMDB.src('app:foo', user.id).keep(5, 10).from(getPosts).get(user)
        }

        const a1 = await getPostsHandler(a)
        const b1 = await getPostsHandler(b)
        const c1 = await getPostsHandler(c)

        deepEqual(a.id, a1.id)
        deepEqual(b.id, b1.id)
        deepEqual(c.id, c1.id)
    })

    // 检查缓存自动更新策略
    it('test cache', async () => {
        const arr = [4, 5, 6]
        const rmdb = RMDB.src('test:f2')
            .keep(160, 200)
            .from(() => arr)
        await rmdb.get()
        await rmdb.clear()
        await sleep(200)
        const data = await rmdb.get()
        deepEqual(arr, data)
        rmdb.clear()
    })

    // 检查自动更新标记
    it('test update sign', async () => {
        const arr = [7, 8, 9]
        const rmdb = RMDB.src('test:f3')
            .keep(160, 200)
            .from(() => arr)
        const data = await rmdb.get()
        deepEqual(arr, data)

        await redis.expire('test:f3:update', 0)
        await sleep(100)
        arr.push(0)
        const data2 = await rmdb.get()
        deepEqual(arr, data2)
        notDeepEqual([7, 8, 9], data2)

        await sleep(200)
        await rmdb.clear()
    })
})
