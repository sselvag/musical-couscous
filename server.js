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
          "View Departments",
          "Add Department",
          "View Roles",
          "Add Role",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "Delete Department",
          "Delete Role",
          "Exit"
        ],
        pageSize: 14,
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
      else if (answers.init === "View Departments") {
          showAllDepartments();
      }
      else if (answers.init === "Add Department") {
          addDept();
      }
      else if (answers.init === "View Roles") {
          showAllRoles();
      }
      else if (answers.init === "Add Role") {
          addRole();
      }
      else if (answers.init === "Remove Employee") {
          deleteEmployee();
      }
      else if (answers.init === "Update Employee Role") {
          updateEmployeeRole();
      }
      else if (answers.init === "Update Employee Manager") {
          updateEmployeeManager();
      }
      else if (answers.init === "Delete Department") {
          deleteDept();
      }
      else if (answers.init === "Delete Role") {
          deleteRole();
      }
      else if (answers.init === "Exit") {
          connection.end();
      }
      else {
          connection.end();
      }
    })
    .catch(err => {
      if (err) {
        console.log(err)
      }
    });
  };

    const showAllEmployees = () => {
        let results = connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;",

        function (error, results) {
            if (error) throw error
            console.table(results)
            initPrompt();
        })
    };

    const showAllEmployeesByDept = () => {
        let results = connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY department.id;",

        function (error, results) {
            if (error) throw error
            console.table(results)
        })
        initPrompt();
    };

    const showAllEmployeesByDept = () => {
      return inquirer.prompt([
          {
              type: 'input',
              name: 'deptID',
              message: "What is the id of the department you would like to view?"
          },
      ]).then(answers => {
      let results = connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE department.id = ?",
      [answers.deptID],

      function (error, results) {
          if (error) throw error;
          console.table(results);
          initPrompt();
      })
  });
  };

  const showAllEmployeesByManager = () => {
      return inquirer.prompt([
          {
              type: 'input',
              name: 'managerID',
              message: "What is the id of the manager you would like to view?"
          },
      ]).then(answers => {
      let results = connection.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.dept_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE employee.manager_id = ?",
      [answers.managerID],

      function (error, results) {
          if (error) throw error;
          console.table(results);
          initPrompt();
      })
  });
  };

  const addEmployee = () => {
      return inquirer.prompt([
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
          if (error) throw error;
          console.table(results);
          console.log(`employee "${answers.employeeFirst} ${answers.employeeLast}" was successfully added to the database!`)
          //showAllEmployees();
          initPrompt();
      })
  });
  };

  const showAllDepartments = () => {
      let results = connection.query("SELECT * FROM department;",

      function (error, results) {
          if (error) throw error;
          console.table(results);
          initPrompt();
      })
  };

  const addDept = () => {
      return inquirer.prompt([
          {
              type: 'input',
              name: 'deptName',
              message: "What is the name of the department you would like to add?",
              validate: answer => {
                  if (answer !== "") {
                      return true;
                  }
                  return "Please enter a valid name";
              }
          },
      ]).then(answers => {
      let results = connection.query("INSERT INTO department SET dept_name = ?",
      [answers.deptName],

      function (error, results) {
          if (error) throw error;
          console.table(results);
          console.log(`New department "${answers.deptName}" was successfully added to the database!`)
          initPrompt();
      })
  });
  };

  const showAllRoles = () => {
      let results = connection.query("SELECT * FROM roles;",

      function (error, results) {
          if (error) throw error;
          console.table(results);
          initPrompt();
      })
  };

  const addRole = () => {
      return inquirer.prompt([
          {
              type: 'input',
              name: 'roleTitle',
              message: "What is the name of the role you would like to add?",
              validate: answer => {
                  if (answer !== "") {
                      return true;
                  }
                  return "Please enter a valid name";
              }
          },
          {
              type: 'input',
              name: 'roleSalary',
              message: "What is the salary for this role??"
          },
          {
              type: 'input',
              name: 'roleDept',
              message: "What departmentID is this role under?"
          },
      ]).then(answers => {
      let results = connection.query("INSERT INTO roles SET title = ?, salary = ?, department_id = ?",
      [answers.roleTitle, answers.roleSalary, answers.roleDept],

      function (error, results) {
          if (error) throw error;
          console.table(results);
          console.log(`New Role "${answers.roleTitle}" has been successfully added to the database!`)
          initPrompt();
      })
  });
  };

  const deleteEmployee = () => {
      return inquirer.prompt([
          {
              type: 'input',
              name: 'deleteEmployeeID',
              message: "What is the id of the employee you would like to delete?"
          },
      ]).then(answers => {
      let results = connection.query("DELETE FROM employee WHERE id = ?",
      [answers.deleteEmployeeID],

      function (error, results) {
          if (error) throw error;
          console.table(results);
          console.log(`employeeID "${answers.deleteEmployeeID}" has been successfully purged from the database!`)
          initPrompt();
      })
  });
  };

  const updateEmployeeRole = () => {
      return inquirer.prompt([
          {
              type: 'input',
              name: 'updateEmployeeID',
              message: "What is the id of the employee you would like to update the role for?"
          },
          {
              type: 'input',
              name: 'updateRoleID',
              message: "What is the id of the role you would like to update this employee to?"
          },
      ]).then(answers => {
      let results = connection.query("UPDATE employee SET role_id = ? WHERE id = ?",
      [answers.updateRoleID, answers.updateEmployeeID],

      function (error, results) {
          if (error) throw error;
          console.table(results);
          console.log(`employeeID "${answers.updateEmployeeID}" has been successfully updated to the new roleID: ${answers.updateRoleID}`)
          initPrompt();
      })
  });
  };

  const updateEmployeeManager = () => {
      return inquirer.prompt([
          {
              type: 'input',
              name: 'updateManagerEmployeeID',
              message: "What is the id of the employee you would like to update the manager for?"
          },
          {
              type: 'input',
              name: 'updateManagerID',
              message: "What is the id of the manager you would like to update this employee to?"
          },
      ]).then(answers => {
      let results = connection.query("UPDATE employee SET manager_id = ? WHERE id = ?",
      [answers.updateManagerID, answers.updateManagerEmployeeID],

      function (error, results) {
          if (error) throw error;
          console.table(results);
          console.log(`employeeID "${answers.updateManagerEmployeeID}" has been updated and the ID of their manager is now "${answers.updateManagerID}"`)
          initPrompt();
      })
  });
  };

  const deleteRole = () => {
      return inquirer.prompt([
          {
              type: 'input',
              name: 'deleteRoleID',
              message: "What is the id of the role you would like to delete?"
          },
      ]).then(answers => {
      let results = connection.query("DELETE FROM roles WHERE id = ?",
      [answers.deleteRoleID],

      function (error, results) {
          if (error) throw error;
          console.table(results);
          console.log(`roleID "${answers.deleteRoleID}" has been successfully purged from the database!`)
          initPrompt();
      })
  });
  };

  const deleteDept = () => {
      return inquirer.prompt([
          {
              type: 'input',
              name: 'deleteDeptID',
              message: "What is the id of the department you would like to delete?"
          },
      ]).then(answers => {
      let results = connection.query("DELETE FROM department WHERE id = ?",
      [answers.deleteDeptID],

      function (error, results) {
          if (error) throw error;
          console.table(results);
          console.log(`departmentID "${answers.deleteDeptID}" has been successfully purged from the database!`)
          initPrompt();
      })
  });
  };