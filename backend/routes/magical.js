var express = require('express');
var router = express.Router();
var connection = require('./mydb');
var mysql = require('mysql');

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/runicsearch', function (req, res) {
  connection.query('SELECT userunic_rid FROM useRunic where userunic_pid =?', req.body.pid, function (err, result) {
    if (err) {
      console.log(err);
      throw err;
    }
    res.send(result);
  });
});

router.post('/playerRunicSearch', function (req, res) {
  var pattenArr = req.body.arr;
  var sql = 'or runic_id = ?';
  var sqls = '';
  pattenArr.forEach(element => {
    sqls += mysql.format(sql, element);
  });
  // console.log(sql);
  // console.log(sqls);
  connection.query('SELECT * FROM runic where runic_id = 0 ' + sqls, function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    }
    res.send(result);
  });
});

router.post('/playerArcaneSearch', function (req, res) {
  console.log(req.body.arr);
  connection.query("SELECT ua_pid,ua_aid FROM useArcane where ua_pid = '?' ", req.body.arr, function (err, result) {
    var ArcaneList = [];
    var sql = 'or arcane_id =?'
    var sqls = '';
    ArcaneList.push(result[0].ua_aid.split(","));
    ArcaneList[0].forEach((element) => {
      sqls += mysql.format(sql, element);
    });
    connection.query("SELECT * FROM arcane where arcane_id = 0 " + sqls, function (err, result2) {
      res.send(result2);
    })
    // res.send(ArcaneList[0][0]);
  });
  router.post('/SearchPatten', function (req, res) {
    console.log("SP");
    res.send("hello");
  })
});

module.exports = router;