const router = require('koa-router')();
const userModel = require('../lib/mysql.js')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin;
// 重置到文章页
router.get('/', async(ctx, next) => {
    ctx.redirect('/moments')
})
// 
router.get('/moments', async(ctx, next) => {
    let res,
        postsLength,
        name = decodeURIComponent(ctx.request.querystring.split('=')[1]);
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
        await userModel.findAllMoments()
            .then(result=>{
                res = result
            })    
        await ctx.render('moments', {
            session: ctx.session,
            posts: res
        })
    }
})
// 首页分页，每次输出10条
router.post('/moments', async(ctx, next) => {
    await userModel.findAllMoments()
            .then(result=>{
                //console.log(result)
                ctx.body = result   
            }).catch(()=>{
            ctx.body = 'error'
        })  
})
// 个人文章分页，每次输出10条
router.post('/moments/self', async(ctx, next) => {
    let name = ctx.request.body.name
    await userModel.findMomentsByName(name)
            .then(result=>{
                //console.log(result)
                ctx.body = result   
            }).catch(()=>{
            ctx.body = 'error'
        })  
})
module.exports = router