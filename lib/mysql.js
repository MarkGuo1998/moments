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


let createTable = function(sql) {
  return query(sql, [])
}

createTable(users)

let insertData = function(value) {
  let _sql = "insert into users set name=?,password=?;"
  return query(_sql, value)
}

let signUp = function(value) {
	let _sql = "insert into users set name=?, password=?;"
	return query(_sql, value)
}

let findDataByName = function (name) {
  let _sql = 'select * from users where name="'+name+'";'
  return query(_sql)
}

module.exports = {
        query,
        createTable,
        insertData,
        signUp,
        findDataByName
        }