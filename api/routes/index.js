var express = require('express');
const { createConnection } = require("../config/dbConnect");
var router = express.Router();

/* GET home page. */
router.get('/getNotification', async function(req, res, next) {
  let connection = await createConnection();
    
    connection.query("SELECT * from applications LIMIT 10 OFFSET 0", function (err, result, fields) {
      if (err) {
        res.status(500).json({message: 'Something Went wrong. Please contact administrator'});
      }
      res.status(200).json({ title: 'Express' , data: result});
    });
});

router.get('/dashboard-count', async function(req, res, next) {
  let connection = await createConnection();
    let countQuery = `SELECT application_status, count(*) as count
    FROM applications
    where application_status in ('Authorized Signatory Approved', 'AML Approved') 
    GROUP BY application_status`
    connection.query(countQuery, function (err, result, fields) {
      if (err) {
        res.status(500).json({message: 'Something Went wrong. Please contact administrator'});
      }
      res.status(200).json({ title: 'Express' , data: result});
    });
});


router.get('/total-count', async function(req, res, next) {
  let connection = await createConnection();
    let countQuery = `SELECT count(*) as count
    FROM applications`
    connection.query(countQuery, function (err, result, fields) {
      if (err) {
        res.status(500).json({message: 'Something Went wrong. Please contact administrator'});
      }
      res.status(200).json({ title: 'Express' , totalCount: result[0].count});
    });
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
