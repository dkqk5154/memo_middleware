const mysql = require('mysql');

let connection = mysql.createPool({
    host     : 'mariadb.cjlzwo326kea.ap-northeast-2.rds.amazonaws.com',
    user     : 'mariadb',
    password : 'mariadb123',
    database : 'hht',
    multipleStatements: true
  });

module.exports=connection;
