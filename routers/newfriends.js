const router = require('koa-router')();
const userModel = require('../lib/mysql.js');
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin
// const moment = require('moment');
const fs = require('fs')
// 
router.get('/newfriends', async(ctx, next) => {
    //await checkNotLogin(ctx)
    await ctx.render('newfriends', {
        session: ctx.session,
    })
})
// post 添加好友请求
router.post('/newfriends', async(ctx, next) => {
//console.log(ctx.request.body)
    let user = {
        name: ctx.request.body.name,
        friendname: ctx.request.body.friendname,
        greeting: ctx.request.body.greeting,
    }
    //console.log(user.name);
    await userModel.findUserByName(user.friendname)
        .then(async (result) => {
            console.log(result)
            if (result.length) {
                await userModel.signUp([user.name, user.friendname, user.greeting])
                    .then(res=>{
                        console.log('好友请求已发送',res)
                        //注册成功
                        ctx.body = {
                            data: 1
                        };
                    })
    
            } else {
                try {
                    throw Error('用户不存在')
                } catch (error) {
                    //处理err
                    console.log(error)
                }
                // 用户不存在
                ctx.body = {
                    data: 2
                };
            }
        })
})
module.exports = router