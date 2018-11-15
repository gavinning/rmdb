const RMDB = require('../../')
const redis = require('../mock/redis')
const mysql = require('../mock/mysql')

class BaseRMDB extends RMDB {
    constructor(options) {
        options.redis = redis
        options.mysql = mysql
        super(options)
    }
}

module.exports = BaseRMDB
