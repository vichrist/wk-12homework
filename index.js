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

