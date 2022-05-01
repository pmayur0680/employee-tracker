USE employeetracker_db;
-- View list of all department names
SELECT id, name from department ORDER BY id;
-- View list of all roles
SELECT role.id, role.title, role.salary, department.name 
FROM role 
JOIN department ON role.department_id = department.id
-- View list of all employees
SELECT employee.id,employee.first_name,employee.last_name,
manager.first_name as manager_first_name,manager.last_name as manager_last_name,
role.title,role.salary,department.name as department_name 
FROM employee employee 
LEFT JOIN employee manager on employee.manager_id = manager.id  
JOIN ROLE on employee.role_id = role.id 
JOIN department ON role.department_id = department.id;
-- Insert into department
INSERT INTO department(name) VALUES (?);
-- Insert into role
INSERT INTO role(title,salary,department_id) VALUES (?, ?, ?);
-- Insert into employee
INSERT INTO employee(first_name,last_name,role_id,manager_id) VALUES (?, ?, ?, ?);
-- Update employee role
UPDATE employee set role_id=? WHERE id=?