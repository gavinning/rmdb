const redis = require('async-redis')
const assert = require('assert')

describe('Redis test', () => {
    it('Redis is ready', done => {
        redis.createClient().on('ready', () => {
            done()
        })
    })
})
