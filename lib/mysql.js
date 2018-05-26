var mysql = require('mysql');
var config = require('../config/default.js')

var pool  = mysql.createPool({
	host     : config.database.HOST,
	user     : config.database.USERNAME,
	password : config.database.PASSWORD,
	database : config.database.DATABASE,
    multipleStatements : true
});

let query = function(sql, values) {
	
	return new Promise((resolve, reject) => {
		pool.getConnection(function(err, connection) {
			if (err) {
				reject(err)
			} else {
				connection.query(sql, values, (err, rows) => {
					if (err) {
						reject(err)
					} else {
						resolve(rows)
					}
					connection.release()
				})
			}
		})
	}) 
}


let users =
    `CREATE TABLE IF NOT EXISTS users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     password VARCHAR(100) NOT NULL,
     PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;`

let moments =
    `CREATE TABLE IF NOT EXISTS moments(
     id INT NOT NULL AUTO_INCREMENT,
     content TEXT(0) NOT NULL,
     uid INT NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (uid) REFERENCES users(id)
) DEFAULT CHARSET=utf8;`

let comments =
    `CREATE TABLE IF NOT EXISTS comments(
     id INT NOT NULL AUTO_INCREMENT,
     uid INT NOT NULL,
     mid INT NOT NULL,
     content TEXT(0) NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (uid) REFERENCES users(id),
     FOREIGN KEY (mid) REFERENCES moments(id)
) DEFAULT CHARSET=utf8;`

let friendrequests = 
    `CREATE TABLE IF NOT EXISTS friendrequests(
    id INT NOT NULL AUTO_INCREMENT,
    uid INT NOT NULL,
    fruid INT NOT NULL,
    greeting TEXT(0) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (uid) REFERENCES users(id),
    FOREIGN KEY (fruid) REFERENCES users(id)
) DEFAULT CHARSET=utf8;`

let friends = 
    `CREATE TABLE IF NOT EXISTS friends(
    uid1 INT NOT NULL,
    uid2 INT NOT NULL,
    PRIMARY KEY (uid1, uid2),
    FOREIGN KEY (uid1) REFERENCES users(id),
    FOREIGN KEY (uid2) REFERENCES users(id)
) DEFAULT CHARSET=utf8;`


let createTable = function(sql) {
  return query(sql, [])
}


let init = function() {
    createTable(users)
    createTable(moments)
    createTable(comments)
    createTable(friendrequests)
    createTable(friends)
    return 0
}

init()

// users 操作

let signUp = function(value) {
	let _sql = `INSERT INTO users SET name = ?, password = ?;`
	return query(_sql, value)
}

let deleteUser = function(name) {
    let _sql = `DELETE FROM users WHERE name="${name}";`
    return query(_sql)
}

let findUserByName = function(name) {
    let _sql = `SELECT * FROM users WHERE name="${name}";`
    return query(_sql)
}

// moments 操作

let findMomentsByName = function(name) {
    let _sql = 
        `SELECT moments.id, moments.content, moments.uid, users.name
         FROM moments, users 
         WHERE moments.uid = users.id
         AND users.name = "${name}";`
    return query(_sql)
}

let findFriendsMomentsByUid = function(id) {
    let _sql = 
        `SELECT moments.id, moments.content, moments.uid, users.name
         FROM moments, users, friends
         WHERE moments.uid = friends.uid2
         AND users.id = friends.uid2
         AND friends.uid1 = ${id};`
    return query(_sql)
}

let findAllMoments = function() {
    let _sql = 
        `SELECT moments.id, moments.content, users.name
         FROM moments, users
         WHERE moments.uid = users.id;`
    return query(_sql)
}

let insertMoment = function(value) {
    let _sql = `INSERT INTO moments SET content = ?, uid = ?;`
    return query(_sql, value)
}

let findMomentByMID = function(id) {
    let _sql = 
        `SELECT moments.id, moments.content, users.name
         FROM moments, users
         WHERE moments.uid = users.id
         AND moments.id = ${id};`
    return query(_sql)
}

let findMomentCommentsByMID = function(id) {
    let _sql = 
        `SELECT moments.content AS mcontent, users_moments.name AS mname, comments.content AS ccontent, users_comments.name AS cname, moments.id, comments.id AS cid
         FROM moments, users AS users_moments, comments, users AS users_comments
         WHERE moments.uid = users_moments.id
         AND moments.id = ${id}
         AND comments.uid = users_comments.id
         AND comments.mid = moments.id;`
    return query(_sql)
}

// comments 操作

let insertComment = function(value) {
    let _sql = `INSERT INTO comments SET uid = ?, mid = ?, content = ?;`
    return query(_sql, value)
}

let deleteComment = function(id) {
    let _sql = `DELETE FROM comments WHERE id = ${id};`
    return query(_sql)
}

let deleteAllMomentComments = function(id) {
    let _sql = `DELETE FROM comments WHERE mid = ${id};`
    return query(_sql)
}

let deleteMoment = function(id) {
    let _sql = `DELETE FROM moments WHERE id = ${id};`
    return query(_sql)
}

// 添加接受好友 操作

let alreadyFriends = function(value) {
    let _sql = `SELECT * FROM friends WHERE uid1 = ? AND uid2 = ?;`
    return query(_condition, value)
}

let insertRequest = function(value) {
    let _sql = `INSERT INTO friendrequests SET uid = ?, fruid = ?, greeting = ?;`
    return query(_sql, value)
}

let findRequestByUidFruid = function(uid, fruid) {
    let _sql = 
        `SELECT * FROM friendrequests
         WHERE (uid = ${uid} AND fruid = ${fruid}) OR (uid = ${fruid} AND fruid = ${uid});`
    return query(_sql)
}

let findUidFruidByRequest = function(id) {
    let _sql =  `SELECT uid, fruid FROM friendrequests WHERE id = ${id};`
    return query(_sql)
}

let findRequestByFruid = function(id) {
    let _sql = 
        `SELECT users.name, users.id, friendrequests.greeting, friendrequests.id AS rid
         FROM friendrequests, users
         WHERE users.id = friendrequests.uid
         AND friendrequests.fruid = ${id};`
    return query(_sql)
}

let deleteRequest = function(id) {
    let _sql = `DELETE FROM friendrequests WHERE id = ${id};`
    return query(_sql)
}

let insertFriend = function(value) {
//    console.log(value)
    let _sql = `INSERT INTO friends SET uid1 = ?, uid2 = ?; INSERT INTO friends SET uid1 = ?, uid2 = ?;`
    return query(_sql, value)
}

let findFriendByUid = function(id) {
    let _sql = 
        `SELECT users.name, users.id
         FROM friends, users
         WHERE users.id = friends.uid2
         AND friends.uid1 = ${id};`
    return query(_sql)
}

//exports

module.exports = {
    query,
    createTable,
    init,
    signUp,
    deleteUser,
    findUserByName,
    findMomentsByName,
    findAllMoments,
    insertMoment,
    findMomentByMID,
    findMomentCommentsByMID,
    insertComment,
    deleteComment, 
    deleteAllMomentComments,
    deleteMoment,
    alreadyFriends,
    insertRequest,
    findRequestByFruid, 
    deleteRequest,
    insertFriend,
    findRequestByUidFruid,
    findUidFruidByRequest,
    findFriendsMomentsByUid,
    findFriendByUid
}