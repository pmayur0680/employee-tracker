USE employeetracker_db;
INSERT INTO department(name)
VALUES ("Finance"),
       ("HR"),       
       ("IT"),
       ("Marketing"),
       ("Sales"); 

INSERT INTO role(title, salary, department_id)
VALUES ("Chief Financial Officer", 220000, 1),
       ("Financial Accountant", 70000, 1),
       ("Tax Accountant", 66000, 1),
       ("Human Resources Manager", 110000, 2),       
       ("Recruiting Manager", 78000, 2),        
       ("Project Manager", 88727, 3),               
       ("Senior Software Engineer", 115015, 3),                      
       ("Front End Developer", 87240, 3),               
       ("Marketing Director", 130000, 4),     
       ("Regional Sales Manager", 120000, 5),
       ("Sales Associate", 25000, 5);            

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Perry", "Scope", 1, NULL),
       ("Allie", "Grater", 2, 1),
       ("Ginger", "Plant", 3, 1),
       ("Karen", "Onnabit", 4, NULL),
       ("Anita", "Bath", 5, 4),
       ("Lynne", "Gwafranca", 6, NULL),
       ("Penny", "Black", 7, 6),
       ("Santi", "Argo", 8, 6),
       ("Ivan", "Notheridiya", 9, NULL),
       ("Clifford", "Clark", 10, 9),
       ("James", "Oliver", 11, 9);