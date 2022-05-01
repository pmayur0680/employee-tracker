// Include packages needed for this application
const inquirer = require('inquirer'); // https://www.npmjs.com/package/inquirer
const mysql = require('mysql2'); // https://www.npmjs.com/package/mysql2 
const cTable = require('console.table'); // https://www.npmjs.com/package/console.table
// Include all required clases
const Department = require('./lib/Department');
// const Employee = require('./lib/Employee');
// const Role = require('./lib/Role');
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
function viewAllDepartments()
{
   // Get a list of departments from the server   
    
   // send user back to menu
    startApplication();
}
// Show choices to user
const startApplication = () => {
    inquirer.prompt(menuOptions)
    .then((answers) => {
        switch (answers.userChoice) {
            case "View all departments":
                viewAllDepartments();
                break;        
            case "Exit":
                break;
            default:
                break;
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
