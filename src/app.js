const BaseRMDB = require('./service/rmdb')

class RMDB {
    constructor({ key }) {
        this.key = key
    }

    keep(updateTime, expireTime) {
        this.updateTime = updateTime
        this.expireTime = expireTime
        return this
    }

    from(dataSource) {
        return BaseRMDB.init({
            key: this.key,
            redis: RMDB.redis,
            timeout: this.expireTime,
            dataSource,
            updateSign: {
                key: RMDB.getKey(this.key, 'update'),
                timeout: this.updateTime || 60 * 10
            }
        })
    }

    static init() {
        return new this(...arguments)
    }

    static getKey() {
        return Array.from(arguments).join(':')
    }

    static src() {
        return this.init({ key: this.getKey(...arguments) })
    }
}

module.exports = (redis) => {
    RMDB.redis = redis
    return RMDB
}

// RMDB.src(key).keep(60 * 5).from(() => dataSource())
