var express = require('express');
var router = express.Router();
var connection = require('./mydb');
var mysql = require('mysql');


router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/search', function (req, res) {
  connection.query('SELECT * FROM test_crud.useEquipment ue left join equipment e on ue.eid = e.equipment_id where ue.pid = ? and ue.use = 1 and e.equipment_part = ?;', [req.body.pid, req.body.part], function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    }
    res.send(result);
  });
});

router.post('/searchRange', function (req, res) {
  var targetArr = req.body.pid;
  // console.log(targetArr);
  var sql = 'or(ue.pid = ? and ue.use = 1 and e.equipment_part = ?)';
  var sqls = '';
  targetArr.forEach(element => {
    sqls += mysql.format(sql, element)
  });
  console.log(sqls);

  var querysql = `SELECT * FROM test_crud.useEquipment ue left join equipment e on ue.eid = e.equipment_id where (ue.pid = 0 and ue.use = 0 and e.equipment_part = 0)`;
  connection.query(querysql + sqls, function (err, result) {
    if (err) {
      console.log(err);
      throw err;
    }
    res.send(result);
  });
});

module.exports = router;