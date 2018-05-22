const router = require('koa-router')();
const userModel = require('../lib/mysql.js')
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin

router.get('/signin', async(ctx, next) => {
    await checkNotLogin(ctx)
    await ctx.render('signin', {
        session: ctx.session,
    })
})
module.exports=router