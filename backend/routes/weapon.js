var express = require('express');
var router = express.Router();
var connection = require('./mydb');
var mysql = require('mysql');

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/showWeapon', function (req, result) {
  connection.query('SELECT * FROM weapon', function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    }
    res.send(result);
  })
});

router.post('/search', function (req, res) {
  connection.query('SELECT * FROM test_crud.useWeapon uw left join weapon w on uw.wid = w.weapon_id where uw.pid = ? and uw.use = 1;', req.body.pid, function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    }
    res.send(result);
  });
});

router.post('/searchPatten', function (req, res) {
  var pattenArr = req.body.arr;
  var sql = 'or patten_id = ?';
  var sqls = '';
  pattenArr.forEach(element => {
    sqls += mysql.format(sql, element);
  });
  // console.log(sql);
  // console.log(sqls);
  connection.query('SELECT * FROM attackPatten where patten_id = 0 ' + sqls, function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    }
    res.send(result);
  });
});


module.exports = router;