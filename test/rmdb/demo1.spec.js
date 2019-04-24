const assert = require('assert')
const redis = require('../mock/redis')
const RMDB = require('../../src/app')(redis)


describe('RMDB Class test', () => {

    function sleep(time) {
        return new Promise((res, rej) => {
            setTimeout(res, time)
        })
    }

    // 检查核心功能
    it('test base', async() => {
        const arr = [1,2,3]
        const rmdb = RMDB.src('test:f1').keep(160, 200).from(() => arr)
        const data = await rmdb.get()
        assert.deepEqual(arr, data)
        rmdb.clear()
    })

    // 检查缓存自动更新策略
    it('test cache', async() => {
        const arr = [4,5,6]
        const rmdb = RMDB.src('test:f2').keep(160, 200).from(() => arr)
        await rmdb.get()
        await rmdb.clear()
        await sleep(200)
        const data = await rmdb.get()
        assert.deepEqual(arr, data)
        rmdb.clear()
    })

    // 检查自动更新标记
    it('test update sign', async() => {
        const arr = [7,8,9]
        const rmdb = RMDB.src('test:f3').keep(160, 200).from(() => arr)
        const data = await rmdb.get()
        assert.deepEqual(arr, data)

        await rmdb.redis.expire(rmdb.updateSign.key, 0)
        await sleep(100)
        arr.push(0)
        const data2 = await rmdb.get()
        assert.deepEqual(arr, data)
        assert.notDeepEqual([7,8,9], data)

        await sleep(200)
        await rmdb.clear()
    })
})
