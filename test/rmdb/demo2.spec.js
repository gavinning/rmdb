const assert = require('assert')
const RMDB = require('./BaseRMDB')


describe('RMDB instance test', () => {

    const rmdb = new RMDB({
        timeout: 10,
        query: type => {
            return rmdb.mysql.query('select * from tag where type = ?', [type])
        }
    })

    it('Get 水果 from RMDB', async() => {
        const data = await rmdb.key('水果').get(1)
        assert.equal(3, data.length)
    })

    it('Get 动物 from RMDB', async() => {
        const data = await rmdb.key('动物').get(2)
        assert.equal(4, data.length)
    })

    it('Get 交通工具 from RMDB', async() => {
        const data = await rmdb.key('交通工具').get(3)
        assert.equal(2, data.length)
    })

    it('Get 地域 from RMDB', async() => {
        const data = await rmdb.key('地域').get(4)
        assert.equal(1, data.length)
    })
})
