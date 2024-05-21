var express = require('express');
const { createConnection } = require("../config/dbConnect");
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let connection = await createConnection();
  // A simple SELECT query
  // connection.connect(function(err) {
  //   if (err) throw err;
    connection.query("SELECT * from applications", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  res.render('index', { title: 'Express' });
});

router.post('/authenticate', async function(req, res, next) {
  let reqBody = req.body;
  let username = reqBody.username;
  let password = reqBody.password;

  let connection = await createConnection();
  let sqlQuery = `SELECT * FROM USER WHERE username='${username}' AND password='${password}'`
  connection.query(sqlQuery, function (err, result, fields) {
    if (err) {
      res.status(500).json({message: 'Something Went wrong. Please contact administrator'});
    };
    if(result.length == 1){
      req.session.user = result[0]
      res.status(200).json({message: 'User logged in successfull'})
    }else{
      res.status(400).json({message: 'Invalid Credentials'})
    }
    console.log(result);
  });
});


module.exports = router;
