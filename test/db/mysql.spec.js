const db = require('../mock/mysql')
const assert = require('assert')

describe('Mysql test', () => {
    it('Mysql is ready', async() => {
        try {
            const res = await db.query('show databases')
            assert.equal(true, Array.isArray(res))
        }
        catch(err) {
            assert.equal(false, !!err)
        }
    })
})
