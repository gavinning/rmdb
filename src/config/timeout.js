/**
 * 
 * @desc Redis Key 过期方式
 * @date 2018-11-12
 * @author gavinning gavinning@qq.com
 *
 * @history
 *    created at 2018-11-12 by gavinning
 *
 */

const timeout = module.exports = {
    // Redis数据过期方式
    options: ['EX', 'PX', 'NX', 'XX'],

    // 默认过期方式
    default: {
        type: 'EX',
        // 默认过期时间为 1小时
        value: 60 * 60
    }
}

timeout.isVaildType = type => {
    return timeout.options.includes(type)
}
