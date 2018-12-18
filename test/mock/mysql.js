const pm = require('promise-mysql')
const db = module.exports = pm.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test',
    port: 32783,
    connectionLimit: 10
})
