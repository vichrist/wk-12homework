// importing depencies 
const express = require('express'); 
const mysql = require('mysql');
const inquirer = require('inquirer'); 


// create server 
const app = express(); 

// set PORT 
const PORT = process.env.PORT | 8080; 

// create connection 
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306, 
    user: 'root',
    password: 'Lelamylove0221', 
    database: 'employee_db'
}); 

// initiate connection 
connection.connect((err) => {
    if (err) {
        console.log("Error Connection:" + err.stack); 
        return; 
    }
    console.log("Connected to Database: " + connection.threadId); 
});

///////////////////////// LOGIC ///////////////////////// 


const actionDatabase = () => {
    return inquirer.prompt([
        {
            name: 'database',
            message: 'Select what you would like to do',
            type: 'list',
            choices: [
                'Add Departments', 
                'Add Roles', 
                'Add Employee', 
                'View Departments', 
                'View Roles', 
                'View Employees',
                'Update employeeRoles',  
                'I am finished, Exit!'
            ]
        }

    ]).then(function ({ database}) {
        switch (database) {
            case 'Add Departments':
                addDepartment();
                break;
            case 'Add Roles':
                addRoles();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'View Departments':
                viewDepartments();
                break; 
            case 'View Roles':
                viewRoles();
                break; 
            case 'View Employees':
                viewEmployees();
                break; 
            case 'Update employeeRoles': 
                updateEmployeeRoles(); 
                break; 
            case 'I am finished, Exit!':
                connection.end(); 
                return; 
        }
    })
};

actionDatabase(); 

const addDepartment = () => {
    inquirer.prompt ({
        name: 'department', 
        type: 'input', 
        message: 'Enter the new name of department', 
    }).then(function(answer) {
        var query = 'INSERT INTO department (name) VALUES (?)';
        connection.query(query, answer.department, (err, res) => {
            console.log(`You added ${(answer.department.toUpperCase())} to departments`);
        }) 
        viewDepartments(); 
    })
};

const viewDepartments = () => {
    var query = "SELECT * FROM department"; 
    connection.query(query, (err, res) => {
        console.log(`DEPARTMENTS`); 
        res.forEach(department => {
            console.log(`ID: ${department.id} | Name: ${department.name}`);
        });
        actionDatabase(); 
    });
};

const addRoles = () => {
    let departments = [];
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err; 
        for (let i = 0; i < res.length; i++) {
            departments.push(res[i].name)
        }
        inquirer.prompt ([
            {
            name: 'title', 
            type: 'input', 
            message: 'Enter the role', 
            },
            {
            name: 'salary', 
            type: 'input', 
            message: 'What will be starting salary for this role',
            },
            {
            name: 'department_id ', 
            type: 'list', 
            message: 'Choose the applicable department for this role', 
            choices: departments
            }         
        ])
        .then(function ({title, salary, department_id}) {
            
            let index = departments.indexOf(department_id);
            connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${title}', '${salary}', ${index})`, (err, res) => {
                if (err) throw err; 
                console.log('You have added a new role');
                viewRoles(); 
            });
        }) 
    })
};


const viewRoles = () => {
    var query = "SELECT * FROM role"; 
    connection.query(query, (err, res) => {
        console.log(`ROLES`); 
        res.forEach(role => {
            console.log(`ID: ${role.id} | Salary: ${role.salary} | Title: ${role.title} | Department ID: ${role.department_id}`);
        });
        actionDatabase(); 
    });
};


const addEmployee = () => {
    
    var employeeRoles = [];
    var employeesAll = [];
    

    connection.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            employeeRoles.push(res[i].title);
        }

    connection.query(`SELECT * FROM employee`, (err, res) => {
        if (err) throw err;
        // console.log('error', err.stack); 
        for (let i = 0; i < res.length; i++) {
            employeesAll.push(res[i].first_name);
        }

        inquirer
            .prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'Enter the first name of the employee'
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Enter the last name of the employee?'
                },
                {
                    name: 'role_id',
                    type: 'input',
                    message: 'Enter the role of the new employee',
                    choices: roles,
                },
                {
                    name: 'manager_id',
                    type: 'input',
                    message: 'Chose the name of the manager for the new employee',
                    choices: ['none'].concat(employeesAll)
                }
                ]).then(function ({ first_name, last_name, role_id, manager_id }) {
                    let queryText = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${employeeRoles.indexOf(role_id)}, ${employeesAll.indexOf(manager_id) + 1})`;
                   
                    console.log(queryText)

                    connection.query(queryText, (err, data) => {
                        if (err) throw err;

                        viewEmployees();
                    })
                })
            })
        })
    }

const viewEmployees = () => {
    var query = "SELECT * FROM employee"; 
        connection.query(query, (err, res) => {
        console.log(`EMPLOYEE LIST`); 
        res.forEach(employee => {
        console.log(`ID: ${employee.id} | Name: ${employee.first_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`);
        });
        actionDatabase(); 
    });
};

const updateEmployeeRoles = () =>{

    connection.query(`SELECT * FROM employee`, (err, res) => {
        if (err) throw err;
    
        let employeesAll = [];
        let rolesAll = [];
    
        for (let i = 0; i < res.length; i++) {
        employeesAll.push(res[i].first_name)
        }
    
    connection.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;
    
        for (let i = 0; i < res.length; i++) {
        rolesAll.push(res[i].title)
        }
    
    inquirer
        .prompt([
        {
            name: 'employee_id',
            type: 'list',
            message: "Select the employee whose role will be updated",
            choices: employeesAll
        },
        {
            name: 'role_id',
            type: 'list',
            message: "Select the new role?",
            choices: rolesAll
        }
        ]).then(function ({ employee_id, role_id }) {
            connection.query(`UPDATE employee SET role_id = ${rolesAll.indexOf(role_id) + 1} WHERE id = ${employeesAll.indexOf(employee_id) + 1}`, function (err, data) {
                if (err) throw err;
    
                actionDatabase();
            })
        })
    })
})
}