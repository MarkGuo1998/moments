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
    await userModel.findRequestByFruid(ctx.session.id)
        .then(result => {
            res = result
            console.log('res', res)
        })
    await ctx.render('friendslist', {
        session: ctx.session,
        posts: res
    })
})
// post 添加好友请求
router.post('/acceptfriends/submit', async(ctx, next) => {
//console.log(ctx.request.body)
    let user = {
        friendname: ctx.request.body.friendname,
        greeting: ctx.request.body.greeting,
    }
    //console.log(user.name);
    await userModel.findUserByName(user.friendname)
        .then(async (result) => {
            console.log('fri: ', user.friendname, ' ;res: ', result)
            if (result.length) {
                console.log('Res ID: ', result[0].id)
                await userModel.insertRequest([ctx.session.id, result[0].id, user.greeting])
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
                };;
            }
        })
})

// 删除好友请求
router.post('/acceptfriends/:rid/remove', async(ctx, next) => {
    let requestId = ctx.params.rid
    console.log("scqq "+ requestId)
    await userModel.deleteRequest(requestId)
        .then(() => {
            console.log("yang sb")
            ctx.body = {
                data: 1
            }
        }).catch(() => {
            console.log("1 < 0")
            ctx.body = {
                data: 2
            }
        })
    
})

// 通过好友请求
router.post('/acceptfriends/:rid/accept', async(ctx, next) => {
    let requestId = ctx.params.rid,
        value
    console.log("requestid = "+ requestId)
    await userModel.findUidFruidByRequest(requestId)
        .then(async(result) =>{
            value = result[0]
            let value_ = [value.uid, value.fruid, value.fruid, value.uid]
            await userModel.insertFriend(value_)
                .then(() => {
                    userModel.deleteRequest(requestId)
                    ctx.body = {
                        data: 1 
                    }
                }).catch(result => {
                    console.log(result)
                    ctx.body = {
                        data: 2
                    }
                })
        })
        
    
})

module.exports = router