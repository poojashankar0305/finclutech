var express = require('express');
var moment = require('moment')
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
    let startDate = req.query.startDate;
    let endDate = req.query.endDate;

    console.log(search);
    if(search){
      let searchCond = [];
      search = search.toLowerCase()
      columns.forEach(element => {
        searchCond.push(`LOWER(${element}) LIKE '%${search}%'`)
      });
      filterCond += "WHERE ("+searchCond.join(" OR ")+")"
    }

    if(startDate && endDate){
      if(filterCond == ""){
        filterCond = filterCond + " WHERE ";
      }else{
        filterCond = filterCond + " AND  ";
      }
      filterCond += ` updated_at >= '${startDate}' AND updated_at <= '${endDate}'`
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


router.post('/addApplication', async function(req, res, next) {
  let reqBody = req.body;
  let connection = await createConnection();
  
  let agentEmail = reqBody.agentEmail;
  let agentFName = reqBody.agentFName;
  let agentLName = reqBody.agentLName;
  let accType = reqBody.accType;
  let appStatus = reqBody.appStatus;
  let buscat = reqBody.busCat;
  let date = moment().format('DD-MM-YYYY HH:mm:ss A');
  let insertQury = `INSERT INTO APPLICATIONS(sales_agent_first_name, sales_agent_last_name, sales_agent_email, account_type, application_status, business_category, created_at, updated_at) VALUES ('${agentFName}', '${agentLName}', '${agentEmail}', '${accType}', '${appStatus}', '${buscat}', '${date}', '${date}')`

  connection.query(insertQury, function (err, result, fields) {
    if (err) {
      console.log(err);
      res.status(500).json({message: 'Something Went wrong. Please contact administrator'});
    }else{
      res.status(200).json({ status: 200, message: 'Application Created Successfully'});
    }
  });
});



router.post('/editApplication', async function(req, res, next) {
  let reqBody = req.body;
  let connection = await createConnection();
  let applicationId = reqBody.applicationId;
  let agentEmail = reqBody.agentEmail;
  let agentFName = reqBody.agentFName;
  let agentLName = reqBody.agentLName;
  let accType = reqBody.accType;
  let appStatus = reqBody.appStatus;
  let buscat = reqBody.busCat;
  let date = moment().format('DD-MM-YYYY HH:mm:ss A');
  let updateQry = `UPDATE APPLICATIONS  SET sales_agent_first_name='${agentFName}', sales_agent_last_name='${agentLName}', sales_agent_email='${agentEmail}', account_type='${accType}', application_status='${appStatus}', business_category='${buscat}', updated_at='${date}' WHERE  business_application_id=${applicationId}`;

  connection.query(updateQry, function (err, result, fields) {
    if (err) {
      console.log(err);
      res.status(500).json({message: 'Something Went wrong. Please contact administrator'});
    }else{
      res.status(200).json({ status: 200, message: 'Application Updated Successfully'});
    }
  });
});


router.post('/deleteApplication', async function(req, res, next) {
  let ID = req.query.id;
  console.log(ID);
  let connection = await createConnection();
  let deleteQry = `DELETE FROM APPLICATIONS WHERE business_application_id=${ID}`
  connection.query(deleteQry, function (err, result, fields) {
    if (err) {
      res.status(500).json({message: 'Something Went wrong. Please contact administrator'});
    }else{
      res.status(200).json({message: 'Application Deleted Successfully'})
    }
    
    console.log(result);
  });
});

module.exports = router;
