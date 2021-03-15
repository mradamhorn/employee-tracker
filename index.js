const connection = require('./db/connection');
const inquirer = require('inquirer');



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
    })
}

// Gets the 'role' table from 'workplaceDB' in sql
const viewRole = () => {
    connection.query('SELECT title AS Role, salary AS Salary FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
    })
}

// Gets the 'employee' table from 'workplaceDB' in sql
const viewEmployee = () => {
    connection.query('SELECT CONCAT(first_name, " ", last_name) AS Employee FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
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
            const query = 'INSERT INTO department (name) VALUES ?''
            connection.query(query, { department: answer.department }, (err, res) => {
                if (err) throw err;


                console.table(res);
            })

        })
}

init();