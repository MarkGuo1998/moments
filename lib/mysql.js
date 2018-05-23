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
    `CREATE TABLE IF NOT EXISTS users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     password VARCHAR(100) NOT NULL,
     PRIMARY KEY (id)
);`

let moments =
    `CREATE TABLE IF NOT EXISTS moments(
     id INT NOT NULL AUTO_INCREMENT,
     content TEXT(0) NOT NULL,
     uid INT NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (uid) REFERENCES users(id)
);`

let comments =
    `CREATE TABLE IF NOT EXISTS comment(
     id INT NOT NULL AUTO_INCREMENT,
     uid INT NOT NULL,
     mid INT NOT NULL,
     content TEXT(0) NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (uid) REFERENCES users(id),
     FOREIGN KEY (mid) REFERENCES moments(id)
);`

let createTable = function(sql) {
  return query(sql, [])
}

createTable(users)
createTable(moments)
createTable(comments)


// users 操作

let signUp = function(value) {
	let _sql = "INSERT INTO users SET name=?, password=?;"
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
        `SELECT moments.id, moments.content, moments.uid
         FROM moments, users 
         WHERE moments.uid = users.id
         AND users.name = "${name}";`
    return query(_sql)
}

let findAllMoments = function () {
    let _sql = "SELECT * FROM moments;"
    return query(_sql)
}



module.exports = {
    query,
    createTable,
    signUp,
    deleteUser,
    findUserByName,
    findMomentsByName,
    findAllMoments
}