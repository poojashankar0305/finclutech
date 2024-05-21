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

/* GET home page. */
router.get('/getAllApplications', async function(req, res, next) {
  let connection = await createConnection();
    let filterCond = '';
    let columns = [
      'sales_agent_first_name',
      'sales_agent_last_name',
      'sales_agent_email',
      'account_type',
      'application_status',
      'business_category',
      'business_application_id'
    ]
    // let { search, startDate, endDate } = req.query;
    let search = req.query.search;
    console.log(search);
    if(search){
      let searchCond = [];
      search = search.toLowerCase()
      columns.forEach(element => {
        searchCond.push(`LOWER(${element}) LIKE '%${search}%'`)
      });
      filterCond = "WHERE ("+searchCond.join(" OR ")+")"
    }
    let selectQry = `SELECT * from applications ${filterCond} order by business_application_id desc`;
    console.log(selectQry);
    connection.query(selectQry, function (err, result, fields) {
      if (err) {
        res.status(500).json({message: 'Something Went wrong. Please contact administrator'});
      }else{
        res.status(200).json({ title: 'Express' , data: result});
      }
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
