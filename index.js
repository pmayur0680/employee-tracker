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
        "View employees by department",
        'Delete department',
        'Delete a role',
        'Delete an employee',
        'View department budget',
        'Exit']
    }
]  
// view all departments  
viewAllDepartments = () => {      
//   Get a list of departments from the server
    const fetchQuery = `SELECT id, name from department ORDER BY id`;
    db.query(fetchQuery, (err, result) => {
        if (err) throw err;   
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
         if (err) throw err;   
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
         if (err) throw err;   
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
            if(!department) {
                return "Please enter department name";            
            }                
            return true;
        }
    }
    ]).then((answers) => {
      const department = answers.department;
      // check if department exists
    const fetchQuery = `SELECT id from department where name='${department}'`;
    db.query(fetchQuery, (err, result) => {        
    if (err) throw err;   
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
            if (err) throw err;   
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
 // add new role
 addRole = () => {
     // prompt user for title, salary, and list of department to choose from
    inquirer.prompt([
    {
        type: 'input', 
        name: 'title',
        message: "What role you want to add?",
        validate: title => {
            if(!title) {
                return "Please enter role title";            
            }                
            return true;        
        }
    },
    {
        type: 'input', 
        name: 'salary',
        message: "What is the salary of this role?",
        validate: salary => {
            if(!salary || isNaN(salary)){                
                return "Please enter valid input";
            }            
            return true;           
        }
    }
    ]).then((answers) => {
      const title = answers.title;
      const salary = answers.salary;
      // prompt for department to choose      
const fetchDepartments = `SELECT id, name from department order by name`;
db.query(fetchDepartments, (err, result) => {        
if (err) throw err;   
else
{
const listOfDepartments = result.map(({ name, id }) => ({ name: name, value: id }));
inquirer.prompt([
    {
        type: 'list', 
        name: 'departmentId',
        message: "Choose department for the role:",
        choices: listOfDepartments
    }
    ]).then((department) => {
        const departmentId = department.departmentId;
        // check if role exists
            const fetchQuery = `SELECT id from role where 
            department_id=${departmentId} and title='${title}'`;
            db.query(fetchQuery, (err, result) => {        
                if (err) throw err;   
                else
                {
                if(result.length > 0)
                {
                    console.log(`role ${title} already exists`);  
                    addRole();              
                }
                else
                {    
                    const insertQuery = `INSERT INTO role(title,salary,department_id) 
                    VALUES (?, ?, ?);`;
                    db.query(insertQuery, [title, salary, departmentId], (err, result) => {
                        if (err) throw err;   
                        else {
                            console.log(`${title} has been added`);   
                            viewAllRoles();  
                    }
                    
                    })    
                }    
                }     
            }) 
    })
}     
      }) 
    })  
 }
  // add new employee
  addEmployee = () => {
    // prompt user for first name, last name, role, and manager
   inquirer.prompt([
   {        
        type: 'input',
        name: 'firstName',
        message: 'What is employee\'s first name?',        
        validate: firstName => {
            if(!firstName) {
                return "Please enter first name";            
            }                
            return true;
        }
   },
   {        
        type: 'input',
        name: 'lastName',
        message: 'What is employee\'s last name?',        
        validate: lastName => {
            if(!lastName) {
                return "Please enter last name";            
            }                
            return true;
        }
   }      
    ]).then((answers) => {
     const firstName = answers.firstName;
     const lastName = answers.lastName;
     // prompt for role to choose      
     const fetchRoles = `SELECT id, title from role order by title`;
     db.query(fetchRoles, (err, result) => {        
       if (err) throw err;   
       else
       {
    const listOfRoles = result.map(({ title, id }) => ({ name: title, value: id }));
    inquirer.prompt([
        {
            type: 'list', 
            name: 'roleId',
            message: 'What is employee\'s job title?',        
            choices: listOfRoles
        }
        ]).then((role) => {
        const roleId = role.roleId;
        // prompt for manager to choose      
        const fetchManager = `SELECT id, first_name, last_name from employee order by 
        first_name, last_name`;
        db.query(fetchManager, (err, result) => {        
            if (err) throw err;   
            else
            {
            const listOfManagers = result.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                listOfManagers.push({name: 'N/A', value: null}); // no manager
                inquirer.prompt([
                    {
                    type: 'list', 
                    name: 'managerId',
                    message: 'Who is the employee\'s manager?',        
                    choices: listOfManagers
                    }
                    ]).then((manager) => {
                const managerId = manager.managerId;
            
                const insertQuery = `INSERT INTO employee(first_name,last_name,role_id,manager_id) 
                VALUES (?, ?, ?, ?);`;
                db.query(insertQuery, [firstName, lastName, roleId, managerId], (err, result) => {
                    if (err) throw err;   
                    else {
                        console.log(`${firstName} ${lastName} has been added`);   
                        viewAllEmployees();  
                    }
                
                })    
                
        })
        }     
      }) 
    })  
    }    
 })  
}) 
}
// Allow employee to update role
updateEmployeeRole = () => {
    // prompt list of employee to choose      
    const fetchEmployee = `SELECT id, first_name, last_name from employee order by first_name, last_name`;
    db.query(fetchEmployee, (err, result) => {        
        if (err) throw err;   
        else
        {
            const listOfEmployee = result.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
            inquirer.prompt([
                {
                    type: 'list', 
                    name: 'employeeId',
                    message: 'Select employee would you like to update?',        
                    choices: listOfEmployee
                }
                ]).then((employee) => {
                    const employeeId = employee.employeeId;
                    //prompt for role to choose  
                    const fetchRoles = `SELECT id, title from role order by title`; 
                    db.query(fetchRoles, (err, result) => {        
                        if (err) throw err;   
                        else
                        {
                     const listOfRoles = result.map(({ title, id }) => ({ name: title, value: id }));
                     inquirer.prompt([
                         {
                             type: 'list', 
                             name: 'roleId',
                             message: 'What is employee\'s new job title?',        
                             choices: listOfRoles
                         }
                         ]).then((role) => {
                         const roleId = role.roleId;
                         const updateQuery = `UPDATE employee SET role_id=? where id=?`;
                         db.query(updateQuery, [roleId, employeeId], (err, result) => {
                             if (err) throw err;   
                             else {
                                 console.log(`Employee role has been updated`);   
                                 viewAllEmployees();  
                             }
                         })
                        })
                        } 
                })  
            })  
        }
    })         
}
// Allow to update employee manager
updateEmployeeManager = () => {
    // prompt list of employee to choose      
    const fetchEmployee = `SELECT id, first_name, last_name from employee order by first_name, last_name`;
    db.query(fetchEmployee, (err, result) => {        
        if (err) throw err;   
        else
        {
            const listOfEmployee = result.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
            inquirer.prompt([
                {
                    type: 'list', 
                    name: 'employeeId',
                    message: 'Select employee would you like to update?',        
                    choices: listOfEmployee
                }
                ]).then((employee) => {
                    const employeeId = employee.employeeId;
                    //prompt for manager to choose  
                    const fetchManager = `SELECT id, first_name, last_name from employee order by first_name, last_name`;
                    db.query(fetchManager, (err, result) => {        
                        if (err) throw err;   
                        else
                        {
                         const listOfManager = result.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                         inquirer.prompt([
                         {
                             type: 'list', 
                             name: 'managerId',
                             message: 'Who is employee\'s new manager?',        
                             choices: listOfManager
                         }
                         ]).then((manager) => {
                         const managerId = manager.managerId;
                         const updateQuery = `UPDATE employee SET manager_id=? where id=?`;
                         db.query(updateQuery, [managerId, employeeId], (err, result) => {
                             if (err) throw err;   
                             else {
                                 console.log(`Employee manager has been updated`);   
                                 viewAllEmployees();  
                             }
                         })
                        })
                        } 
                })  
            })  
        }
    })         
}
//   Get a list of employee by manager
viewEmployeeByManager = () => {    
    const fetchQuery = `SELECT e.first_name, e.last_name, m.first_name as manager_first_name, m.last_name as manager_last_name from 
    employee e JOIN employee m 
    ON e.manager_id=m.id`;
    db.query(fetchQuery, (err, result) => {
        if (err) throw err;   
        else
        {
            console.table(result);
            startApplication();           
        }            
    })   
}
//   Get a list of employee by department
viewEmployeeByDepartment = () => {    
    const fetchQuery = `SELECT employee.first_name, employee.last_name, department.name as department 
    FROM employee JOIN 
    role ON employee.role_id = role.id JOIN 
    department ON role.department_id = department.id`;
    db.query(fetchQuery, (err, result) => {
        if (err) throw err;   
        else
        {
            console.table(result);
            startApplication();           
        }            
    })   
}
// allow user to delete selected department
deleteDepartment = () => {
       // prompt for department to choose      
        const fetchDepartments = `SELECT id, name from department order by name`;
        db.query(fetchDepartments, (err, result) => {        
        if (err) throw err;   
        else
        {
        const listOfDepartments = result.map(({ name, id }) => ({ name: name, value: id }));
        inquirer.prompt([
            {
                type: 'list', 
                name: 'departmentId',
                message: "Choose department to delete:",
                choices: listOfDepartments
            }
            ]).then((department) => {
                  const departmentId = department.departmentId;
                  const deleteQuery = `DELETE FROM department where id=?`;
                       db.query(deleteQuery, departmentId, (err, result) => {
                           if (err) throw err;   
                           else {
                               console.log(`Selected department has been deleted`);   
                               viewAllDepartments();  
                           }                  
              })  
          })  
      }
  })         
}
// allow user to delete selected role
deleteRole = () => {
        // prompt for role to choose      
        const fetchRoles = `SELECT id, title from role order by title`;
        db.query(fetchRoles, (err, result) => {        
        if (err) throw err;   
        else
        {
            const listOfRoles = result.map(({ title, id }) => ({ name: title, value: id }));
            inquirer.prompt([
            {
                type: 'list', 
                name: 'roleId',
                message: "Choose role to delete:",
                choices: listOfRoles
            }
            ]).then((role) => {
            const roleId = role.roleId;
            const deleteQuery = `DELETE FROM role where id=?`;
            db.query(deleteQuery, roleId, (err, result) => {
                if (err) throw err;   
                else {
                    console.log(`Selected role has been deleted`);   
                    viewAllRoles();  
                }                  
                })  
            })  
        }
    })         
  }
// allow user to delete selected employee
deleteEmployee = () => {
    // prompt for employee to choose      
    const fetchEmployee = `SELECT id, first_name, last_name from employee order by first_name, last_name`;
    db.query(fetchEmployee, (err, result) => {        
    if (err) throw err;   
    else
    {
        const listOfEmployee = result.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
        inquirer.prompt([
        {
            type: 'list', 
            name: 'employeeId',
            message: "Choose employee to delete:",
            choices: listOfEmployee
        }
        ]).then((employee) => {
        const employeeId = employee.employeeId;
        const deleteQuery = `DELETE FROM employee where id=?`;
        db.query(deleteQuery, employeeId, (err, result) => {
            if (err) throw err;   
            else {
                console.log(`Selected employee has been deleted`);   
                viewAllRoles();  
            }                  
            })  
        })  
    }
})         
}  
//   View department budget
viewDepartmentBudget = () => {    
    const fetchQuery = `SELECT department.name as department,SUM(role.salary) as budget 
    FROM employee JOIN 
    role ON employee.role_id = role.id JOIN 
    department ON role.department_id = department.id GROUP BY department.name`;
    db.query(fetchQuery, (err, result) => {
        if (err) throw err;   
        else
        {
            console.table(result);
            startApplication();           
        }            
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
            case "Add a role":
                addRole();
                break;                                                   
            case "Add a role":
                addRole();
                break;                                                   
            case "Add an employee":
                addEmployee();
                break;           
            case "Update an employee role":
                updateEmployeeRole();
                break;       
            case "Update employee manager":
                updateEmployeeManager();
                break;                 
            case "View employees by manager":
                viewEmployeeByManager();
                break;  
            case "View employees by department":
                viewEmployeeByDepartment();
                break;           
            case "Delete department":
                deleteDepartment();
                break;      
            case "Delete a role":
                deleteRole();
                break;      
            case "Delete an employee":
                deleteEmployee();
                break;     
            case "View department budget":
                viewDepartmentBudget();
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
