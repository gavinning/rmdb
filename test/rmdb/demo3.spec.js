const assert = require('assert')
const RMDB = require('./BaseRMDB')


describe('RMDB instance test', () => {

    const rmdb = new RMDB({
        timeoutType: 'EX',
        query: 'select * from tag where type = ?'
    })

    it('Get 水果2 from RMDB', async() => {
        const data = await rmdb.key('水果2').get(1)
        assert.equal(3, data.length)
    })

    it('Get 动物2 from RMDB', async() => {
        const data = await rmdb.key('动物2').get(2)
        assert.equal(4, data.length)
    })

    it('Get 交通工具2 from RMDB', async() => {
        const data = await rmdb.key('交通工具2').get(3)
        assert.equal(2, data.length)
    })

    it('Get 地域2 from RMDB', async() => {
        const data = await rmdb.key('地域2').get(4)
        assert.equal(1, data.length)
    })
})
