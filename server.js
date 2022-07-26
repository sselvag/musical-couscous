const fs = require("fs");
const util = require("util");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Hello123!!",
    database: "employee_db"
});

connection.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }
    initPrompt();
})

connection.query = util.promisify(connection.query);

const initPrompt = () => {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'init',
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View All Employees by Department",
            "View All Employees by Manager",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Remove Employee",
            "Update Employee Role",
            "Update Employee Manager"
        ]
      }
    ]).then(answers => {
        if (answers.init === "View All Employees") {
          showAllEmployees();
        } 
        else if (answers.init === "View All Employees by Department") {
          showAllEmployeesByDept();
        }
        else if (answers.init === "View All Employees by Manager") {
          showAllEmployeesByManager();
        }
        else if (answers.init === "Add Employee") {
            addEmployee();
          }
        else {
          generateHTML();
        }
      })
      .catch(err => {
        if (err) {
          console.log(err)
        }
      })
    };

    const showAllEmployees = () => {
        let results = connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;",

        function (error, results) {
            if (error) throw error
            console.table(results)
        })
        initPrompt();
    };

    const showAllEmployeesByDept = () => {
        let results = connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY department.id;",

        function (error, results) {
            if (error) throw error
            console.table(results)
        })
        initPrompt();
    };

    const showAllEmployeesByManager = () => {
        let results = connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY manager.id;",

        function (error, results) {
            if (error) throw error
            console.table(results)
        })
        initPrompt();
    };

    const addEmployee = () => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'employeeFirst',
                message: "What is the employee's first name?"
            },
            {
                type: 'input',
                name: 'employeeLast',
                message: "What is the employee's last name?"
            },
            {
                type: 'input',
                name: 'employeeDept',
                message: "What is this employee's role id?"
            },
            {
                type: 'input',
                name: 'employeeManager',
                message: "What is this employee's manager id?"
            }
        ]).then(answers => {
        let results = connection.query("INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?",
        [answers.employeeFirst, answers.employeeLast, answers.employeeDept, answers.employeeManager],

        function (error, results) {
            if (error) throw error
            console.table(results)
        })
        showAllEmployees()
        initPrompt();
    });
};