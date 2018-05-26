const router = require('koa-router')();
const userModel = require('../lib/mysql.js')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin;
// 重置到文章页
router.get('/', async(ctx, next) => {
    ctx.redirect('/friendmoments')
})
// 
router.get('/friendmoments', async(ctx, next) => {
    console.log("user!!!")
    let res,
        name = decodeURIComponent(ctx.request.querystring.split('=')[1]),
        user = decodeURIComponent(ctx.session.user)
    console.log("user, "+user)
    if (ctx.request.querystring) {
        console.log('ctx.request.querystring', name)
        await userModel.findMomentsByName(name)
            .then(result => {
                res = result
            })
        await ctx.render('selfMoments', {
            session: ctx.session,
            posts: res
        })
    } else {
        console.log('ALLMOMENTS')
        
        await userModel.findFriendsMomentsByUid(ctx.session.id)
            .then(result=>{
                res = result
            }) 
        console.log('全部票圈'+res[1])
        await ctx.render('friendmoments', {
            session: ctx.session,
            posts: res
        })
    }
})

// 首页
router.post('/friendmoments', async(ctx, next) => {
    await userModel.findAllMoments()
            .then(result=>{
                console.log("首页，"+result)
                ctx.body = result   
            }).catch(()=>{
                ctx.body = 'error'
            })  
})


module.exports = router