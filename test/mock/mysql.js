const pm = require('promise-mysql')
const db = module.exports = pm.createPool({
    host: 'centos.shared',
    user: 'root',
    password: 'root',
    database: 'test',
    connectionLimit: 10
})
