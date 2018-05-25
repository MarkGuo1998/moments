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
router.post('/newfriends/submit', async(ctx, next) => {
//console.log(ctx.request.body)
    let user = {
        friendname: ctx.request.body.friendname,
        greeting: ctx.request.body.greeting,
    }
    // check if request has send before, do not allow re-send to the same person
    await userModel.findUserByName(user.friendname)
        .then(async (result) => {
            console.log('fri: ', user.friendname, ' ;res: ', result)
            if (result.length) {
                console.log('Res ID: ', result[0].id)
                await userModel.findRequestByUidFruid(ctx.session.id, result[0].id)
                    .then(async (res) =>{
                        if (res.length) {
                            console.log('重复请求',res)
                            //重复请求
                            ctx.body = {
                                data: 3
                            };
                        }
                        else{
                            await userModel.insertRequest([ctx.session.id, result[0].id, user.greeting])
                                .then(res=>{
                                    console.log('好友请求已发送',res)
                                    //注册成功
                                    ctx.body = {
                                        data: 1
                                    };
                                })
                        }
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
                };;
            }
        })
})

module.exports = router