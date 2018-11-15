const assert = require('assert')
const RMDB = require('./BaseRMDB')


describe('RMDB Class test', () => {

    class QQShare extends RMDB {
        constructor() {
            super({key: 'qqShare', timeout: 10})
        }

        getFromMysql() {
            return this.mysql.query('select * from user order by id desc limit 10')
        }
    }

    const qqShare = new QQShare

    it('Get data from RMDB', async() => {
        const data = await qqShare.get()
        assert.equal(true, Array.isArray(data))
    })

    it('Add new data and update cache', async() => {
        const old = await qqShare.get()
        await qqShare.mysql.query('insert user(username, email) values("tom", 456)')
        await qqShare.update()
        const data = await qqShare.get()
        assert.equal(++old.length, data.length)
    })

    it('Delete data and update cache', async() => {
        const old = await qqShare.get()
        await qqShare.mysql.query('delete from user where username ="tom"')
        await qqShare.update()
        const data = await qqShare.get()
        assert.equal(--old.length, data.length)
    })
})
