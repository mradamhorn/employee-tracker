INSERT INTO `department` (name)
	VALUES ('Sales'), ('Human Resources'), ('Sales'), ('Marketing'), ('Research'), ('Finance');
    
INSERT INTO `role` (title, salary, department_id)
	VALUES ('Salesperson', 60000, 1), ('HR Manager', 65000, 2), ('Accountant', 55000, 6);
    
INSERT INTO `employee` (first_name, last_name, role_id, manager_id)
	VALUES ('Bobby', 'John', 1, null), ('Lisa', 'Simpson', 2, 1), ('Milhouse', 'Van Houten', 3, 1);