const connection = require('./db/connection');
const inquirer = require('inquirer');
const mysql = require('mysql');



const init = () => {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View department',
            'View role',
            'View employee',
            'Add department',
            'Add role',
            'Add employee',
            'Update employee',
            'Exit',
        ],
    })
        .then((answer) => {
            switch (answer.action) {
                case 'Add department':
                    addDepartment();
                    break;

                case 'Add role':
                    addRole();
                    break;

                case 'Add employee':
                    addEmployee();
                    break;

                case 'View department':
                    viewDepartment();
                    break;

                case 'View role':
                    viewRole();
                    break;

                case 'View employee':
                    viewEmployee();
                    break;

                case 'Update employee':
                    updateEmployee();
                    break;

                case 'Exit':
                    connection.end();
                    break;

                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        });
}

// Gets the 'department' table from 'workplaceDB' in sql
const viewDepartment = () => {
    connection.query('SELECT name AS Department FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
}

// Gets the 'role' table from 'workplaceDB' in sql
const viewRole = () => {
    connection.query('SELECT title AS Role, salary AS Salary FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
}

// Gets the 'employee' table from 'workplaceDB' in sql
const viewEmployee = () => {
    connection.query('SELECT CONCAT(first_name, " ", last_name) AS Employee FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
}

// Prompts user to specify department name to add to 'department' table in sql
const addDepartment = () => {
    inquirer.prompt({
        name: 'department',
        type: 'input',
        message: 'What is the new department you would like to add?',
    })
        .then((answer) => {
            const query = 'INSERT INTO department SET ?';
            connection.query(query, { name: answer.department }, (err, res) => {
                if (err) throw err;
                init();
            })

        })
}

const addRole = () => {
    connection.query('SELECT id, name FROM department', (err, res) => {
        inquirer.prompt([
            {
                name: 'role',
                type: 'input',
                message: 'What is the role you want to add?',
            },
            {
                name: 'salary',
                type: 'number',
                message: 'What salary does this role have?',
            },
            {
                name: 'deptId',
                type: 'list',
                message: 'Select the department this role belongs in:',
                choices: res
            }
        ])
            .then((answer) => {
                const query = 'INSERT INTO roles SET ?';
                const deptMatch = res.find((department) => {
                    return department.name === answer.deptId;
                });
                connection.query(query, [{ title: answer.role, salary: answer.salary, department_id: deptMatch.id }], (err, res) => {
                    if (err) throw err;
                    init();
                })
            })
    })
}

const addEmployee = () => {
    connection.query('SELECT id, title AS name FROM roles', (err, resRole) => {
        connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, resEmp) => {
            inquirer.prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'Enter the employee\'s first name:',
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'Enter the employee\'s last name:',
                },
                {
                    name: 'roleId',
                    type: 'list',
                    message: 'Select the employee\'s role:',
                    choices: resRole
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: 'Does this employee report to anyone?',
                    choices: ['Yes', 'No']
                }
            ])
                .then((answer) => {
                    const query = 'INSERT INTO employee SET ?';

                    const roleMatch = resRole.find((employee) => {
                        return employee.name === answer.roleId;
                    });

                    if (answer.manager === 'Yes') {
                        inquirer.prompt([
                            {
                                name: 'managerId',
                                type: 'list',
                                message: 'Select the employee\'s manager:',
                                choices: resEmp
                            }
                        ])
                            .then((manager) => {
                                const manMatch = resEmp.find((employee) => {
                                    return employee.name === manager.managerId;
                                });

                                connection.query(query, [{ first_name: answer.firstName, last_name: answer.lastName, role_id: roleMatch.id, manager_id: manMatch.id }], (err, res) => {
                                    if (err) throw err;
                                    init();
                                })
                            })
                    } else {
                        connection.query(query, [{ first_name: answer.firstName, last_name: answer.lastName, role_id: roleMatch.id }], (err, res) => {
                            if (err) throw err;
                            init();
                        })
                    }
                })



        })
    })
}


const updateEmployee = () => {
    connection.query('SELECT id, title AS name FROM roles', (err, resRole) => {
        connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, resEmp) => {
            inquirer.prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: 'Which employee are you updating?',
                    choices: resEmp
                },
                {
                    name: 'newRole',
                    type: 'list',
                    message: 'What is the employee\'s new role?',
                    choices: resRole
                },
                {
                    name: 'newManager',
                    type: 'list',
                    message: 'Will this employee report to anyone?',
                    choices: ['Yes', 'No']
                }
            ])
                .then((answer) => {
                    const query = 'UPDATE employee SET ? WHERE ?';

                    const roleMatch = resRole.find((employee) => {
                        return employee.name === answer.newRole;
                    });

                    const empMatch = resEmp.find((employee) => {
                        return employee.name === answer.employee;
                    });

                    console.log(roleMatch)

                    if (answer.newManager === 'Yes') {
                        inquirer.prompt([
                            {
                                name: 'managerId',
                                type: 'list',
                                message: 'Select the employee\'s new manager:',
                                choices: resEmp
                            }
                        ])
                            .then((manager) => {
                                const manMatch = resEmp.find((employee) => {
                                    return employee.name === manager.managerId;
                                });

                                connection.query(query, [{ role_id: roleMatch.id, manager_id: manMatch.id }, { id: empMatch.id }], (err, res) => {
                                    if (err) throw err;
                                    init();
                                })
                            })
                    } else {
                        connection.query(query, [{ role_id: roleMatch.id }, { id: empMatch.id }], (err, res) => {
                            if (err) throw err;
                            init();
                        })
                    }
                })
        })
    })
}


init();