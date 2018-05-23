const router = require('koa-router')();
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin;

router.get('/signout', async(ctx, next) => {
    ctx.session = null
    console.log('登出成功')
    ctx.body = true
})

module.exports = router