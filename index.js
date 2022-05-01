// Include packages needed for this application
const inquirer = require('inquirer'); // https://www.npmjs.com/package/inquirer
const mysql = require('mysql2'); // https://www.npmjs.com/package/mysql2 
const cTable = require('console.table'); // https://www.npmjs.com/package/console.table

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'employeetracker_db'
    }
    // ,    console.log(`Connected to the database.`)
  );
  
// menu choices to prompt
const menuOptions = [
    {
        type: 'list',
        name: 'userChoice',
        message: 'Please choose from the following menu options…',        
        choices: ['View all departments', 
        'View all roles', 
        'View all employees', 
        'Add a department', 
        'Add a role', 
        'Add an employee', 
        'Update an employee role',
        'Update employee manager',
        "View employees by manager",
        'Delete department',
        'Delete a role',
        'Delete an employee',
        'View department budget',
        'Exit']
    }
]  
// view all departments  
viewAllDepartments = () => {
   // Get a list of departments from the server
    const fetchQuery = `SELECT id, name from department ORDER BY id`;
    db.query(fetchQuery, (err, result) => {
        if(err) {
            console.log(err.message);                
        }
        else
        {
            console.table(result);
            startApplication();           
        }            
    })   
}
// view all employees  
viewAllEmployees = () => {
    // Get a list of employees from the server
     const fetchQuery = `SELECT employee.id,employee.first_name,employee.last_name,
     manager.first_name as manager_first_name,manager.last_name as manager_last_name,
     role.title,role.salary,department.name as department 
     FROM employee employee 
     LEFT JOIN employee manager on employee.manager_id = manager.id  
     JOIN ROLE on employee.role_id = role.id 
     JOIN department ON role.department_id = department.id;`;
     db.query(fetchQuery, (err, result) => {
         if(err) {
             console.log(err.message);                
         }
         else
         {
             console.table(result);
             startApplication();           
         }            
     })   
 }

// view all roles  
viewAllRoles = () => {
    // Get a list of roles from the server
     const fetchQuery = `SELECT role.id, role.title, role.salary, department.name as department 
     FROM role 
     JOIN department ON role.department_id = department.id`;
     db.query(fetchQuery, (err, result) => {
         if(err) {
             console.log(err.message);                
         }
         else
         {
             console.table(result);
             startApplication();           
         }            
     })   
 }
 // add new department
 addDepartment = () => {
    inquirer.prompt([
    {
        type: 'input', 
        name: 'department',
        message: "What is the name of department you want to add?",
        validate: department => {
        if (department) {
            return true;
        } else {
            console.log('Please enter department name');
            return false;
        }
        }
    }
    ]).then((answers) => {
      const department = answers.department;
      // check if department exists
      const fetchQuery = `SELECT id from department where name='${department}'`;
      db.query(fetchQuery, (err, result) => {        
        if(err) {       
            console.log(err.message);                
        }
        else
        {
           if(result.length > 0)
           {
              console.log(`department ${department} already exists`);  
              addDepartment();              
           }
           else
           {    
            const insertQuery = `INSERT INTO department(name) VALUES (?)`;
            db.query(insertQuery, department, (err, result) => {
                if(err) {
                    console.log(err.message);                
                }
                else {
                    console.log(`${department} has been added`);   
                    viewAllDepartments();  
               }
            
             })    
           }    
        }     
      }) 
    })  
 }
// Show choices to user
const startApplication = () => {    
    inquirer.prompt(menuOptions)
    .then((answers) => {
        switch (answers.userChoice) {
            case "View all departments":
                viewAllDepartments();
                break;  
            case "View all roles":
                viewAllRoles();
                break;            
            case "View all employees":
                viewAllEmployees();
                break;          
            case "Add a department":
                addDepartment();
                break;               
            case "Exit":
                process.exit();
                break;
            default:
                process.exit();
        }
    })
    .catch((err) => console.error(err));  
}
// Create a function to initialize app
function init() {
  console.log("***********************************")
  console.log("*                                 *")
  console.log("*        EMPLOYEE MANAGER         *")
  console.log("*                                 *")
  console.log("***********************************")
  startApplication();
}
// Function call to initialize app
init();
