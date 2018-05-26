const router = require('koa-router')();
const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin
// const moment = require('moment');
const fs = require('fs')
// 
router.get('/friendslist', async(ctx, next) => {
    let res;
    await userModel.findFriendByUid(ctx.session.id)
        .then(result => {
            res = result
            console.log('Mark sb, res', res)
        })
    await ctx.render('friendslist', {
        session: ctx.session,
        posts: res
    })
})


// 删除好友
router.post('/friendslist/:rid/remove', async(ctx, next) => {
    let uid = ctx.params.rid
    console.log("scqq "+ uid + ctx.session.id)
    let value = [uid, ctx.session.id, ctx.session.id, uid]
    await userModel.deleteFriend(value)
        .then(() => {
            console.log("ming sb")
            ctx.body = {
                data: 1
            }
        })
    
})

module.exports = router