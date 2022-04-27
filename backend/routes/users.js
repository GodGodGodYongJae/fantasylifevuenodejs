var express = require('express');
var router = express.Router();
var movies = require('../movies.json');
var connection = require('./mydb');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/t', function (req, res, next) {
  res.send(movies);
});

router.post('/showplayer', function (req, res) {
  connection.query('SELECT * FROM player', function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    }
    res.send(result);
  });
});
router.post('/search', function (req, res) {
  connection.query('SELECT * FROM player where pid = ?', req.body.pid, function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    }
    res.send(result);
  });
});
router.post('/register', function (req, res) {
  const user = {
    'name': req.body.user.name,
    'age': req.body.user.age,
    'sex': req.body.user.sex,
    'race': req.body.user.race
  };
  connection.query('insert into player set ?', user, function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    }
    res.json({
      success: true,
      message: '신규 데이터 저장 완료.'
    })
  });

});

module.exports = router;
