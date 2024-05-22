var mysql = require('mysql2');

async function createConnection(){
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'test@#123',
        database: 'finclutech',
      });
    return connection;
}

module.exports = {
    createConnection 
}

