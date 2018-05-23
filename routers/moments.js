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
// 首页
router.post('/moments', async(ctx, next) => {
    await userModel.findAllMoments()
            .then(result=>{
                //console.log(result)
                ctx.body = result   
            }).catch(()=>{
            ctx.body = 'error'
        })  
})
// 个人文章
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

// 发表文章页面
router.get('/create', async(ctx, next) => {
    await ctx.render('create', {
        session: ctx.session,
    })
})

// post 发表文章
router.post('/create', async(ctx, next) => {
    let content = ctx.request.body.content,
        uid = ctx.session.id
    
    console.log([content, uid])
    await userModel.insertMoment([content, uid])
            .then(() => {
                ctx.body = true
            }).catch(() => {
                console.log("!")
                ctx.body = false
            })

})

// 单篇文章页
router.get('/moments/:postId', async(ctx, next) => {
    let comment_res,
        res,
        pageOne,
        res_pv; 
    await userModel.findDataById(ctx.params.postId)
        .then(result => {
            //console.log(result )
            res = result
            res_pv = parseInt(result[0]['pv'])
            res_pv += 1
           // console.log(res_pv)
        })
    await userModel.updatePostPv([res_pv, ctx.params.postId])
    await userModel.findCommentByPage(1,ctx.params.postId)
        .then(result => {
            pageOne = result
            //console.log('comment', comment_res)
        })
    await userModel.findCommentById(ctx.params.postId)
        .then(result => {
            comment_res = result
            //console.log('comment', comment_res)
        })
    await ctx.render('sPost', {
        session: ctx.session,
        posts: res[0],
        commentLenght: comment_res.length,
        commentPageLenght: Math.ceil(comment_res.length/10),
        pageOne:pageOne
    })

})