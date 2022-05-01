class Database {
    constructor(){
        this.db = mysql.createConnection(
            {
              host: 'localhost',              
              user: 'root',              
              password: '',
              database: 'employeetracker_db'
            }, 
            console.log(`Connected to the database.`)
          );
    }     
}
module.exports = Database;