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
    let res;
    console.log("ctx.params="+ctx.params.postId+", ctx.session="+ctx.session)
    await userModel.findMomentsByMID(ctx.params.postId)
        .then(result => {
            console.log(result)
            res_moment = result
        })
    await userModel.findMomentsCommentsByMID(ctx.params.postId)
        .then(result => {
            console.log(result)
            res = result
        })
    await ctx.render('comments', {
        session: ctx.session,
        //moment_content: res[0],
        //moment_name: res[1],
        //comment_content: res[2],
        //comment_name: res[3],
        //id: res[4]
        res_moment: res_moment,
        posts: res
    })


})

// 发表评论
router.post('/:postId', async(ctx, next) => {
    let uid = ctx.session.id,
        content = ctx.request.body.content,
        momentID = ctx.params.postId
    
    console.log("fbpl, ",[uid, momentID, content])
    await userModel.insertComment([uid, momentID, content])
        .then(() => {
            ctx.body = true
        }).catch(() => {
            ctx.body = false
        })
})