var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "login-lecturehwang.cs6xvw76cwq4.ap-northeast-2.rds.amazonaws.com",
  user: "admin",
  password: "ahdzldfnvl00",
  database: "test_crud",
});

connection.connect(function (err) {
  if (err) {
    console.error('mysql connection error');
    console.error(err);
    throw err;
  }
});

module.exports = connection;