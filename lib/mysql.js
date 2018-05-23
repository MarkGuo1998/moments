var mysql = require('mysql');
var config = require('../config/default.js')

var pool  = mysql.createPool({
	host     : config.database.HOST,
	user     : config.database.USERNAME,
	password : config.database.PASSWORD,
	database : config.database.DATABASE
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
    `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     password VARCHAR(100) NOT NULL,
     PRIMARY KEY (id)
);`

let moments =
    `create table if not exists posts(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     content TEXT(0) NOT NULL,
     uid VARCHAR(40) NOT NULL,
     comments VARCHAR(200) NOT NULL DEFAULT '0',
     pv VARCHAR(40) NOT NULL DEFAULT '0',
     PRIMARY KEY (id)
    );`

let comments =
    `create table if not exists comment(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     content TEXT(0) NOT NULL,
     postid VARCHAR(40) NOT NULL,
     PRIMARY KEY (id)
    );`

let createTable = function(sql) {
  return query(sql, [])
}

createTable(users)
createTable(moments)
createTable(comments)


// users 操作

let signUp = function(value) {
	let _sql = "insert into users set name=?, password=?;"
	return query(_sql, value)
}

let deleteUser = function(name) {
  let _sql = 'delete from users where name="'+name+'";'
  return query(_sql)
}

let findUserByName = function(name) {
  let _sql = 'select * from users where name="'+name+'";'
  return query(_sql)
}

// moments 操作

let findMomentsByName = function(name) {
    let _sql = 'select * from moments where name="'+name+'";'
}

module.exports = {
    query,
    createTable,
    signUp,
    deleteUser,
    findUserByName,
    findMomentsByName
}