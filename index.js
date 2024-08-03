//let's me use inquirer
const inquirer = require('inquirer');

//imports the query function from db.js
const { query } = require('./db');

//creates the ascii title
const asciiArt = `
  ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ ______ 
 |______|______|______|______|______|______|______|______|______|______|______|______|______|
 | | |  ____|               | |                       |__   __|           | |             | |
 | | | |__   _ __ ___  _ __ | | ___  _   _  ___  ___     | |_ __ __ _  ___| | _____ _ __  | |
 | | |  __| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\    | | '__/ _\` |/ __| |/ / _ \\ '__| | |
 | | | |____| | | | | | |_) | | (_) | |_| |  __/  __/    | | | | (_| | (__|   <  __/ |    | |
 | | |______|_| |_| |_| .__/|_\\___/ \\__, |\\___|\\___|    |_|_|  \\__,_|\\___|_|\\_\\___|_|    | |
 | |                  | |             __/ |                                               | |
 |_|____ ______ ______|_|____ ______ |___/_ ______ ______ ______ ______ ______ ______ ____|_|
 |______|______|______|______|______|______|______|______|______|______|______|______|______|
`;

//calls the ascii title
console.log(asciiArt);

//creates a main menu function
async function mainMenu() {

    //makes 'data' the info gathered from my inquirer prompt
    const data = await inquirer.prompt([
        {
            type: 'list',
            name: 'intro',
            message: 'What would you like to do?',
            choices: ['View All Departments',
                      'View All Roles',
                      'View All Employees',
                      'Add A Department',
                      'Add A Role',
                      'Add An Employee',
                      'Update An Employee Role',
                      'Exit'
                     ]
        }
    ]);

    //switch/case to handle the different menu options
    switch(data.intro) {
        //if 'view all departments' is chosen, then runs query and logs a formatted response
        case 'View All Departments':
            const departments = await query('SELECT * FROM department');
            console.log();
            console.table(formatTable(departments.rows));
            console.log();
            break;
        //if 'view all roles' is chosen, then runs query and logs a formatted response
        case 'View All Roles':
            const roles = await query(`
                SELECT role.id, role.title, department.name AS department, role.salary 
                FROM role 
                JOIN department ON role.department_id = department.id`
            );
            console.log();
            console.table(formatTable(roles.rows));
            console.log();
            break;
        //if 'view all employees' is chosen, then runs query and logs a formatted response
        case 'View All Employees':
            const employees = await query(`
                SELECT e.id AS id, e.first_name AS first_name, e.last_name AS last_name, role.title AS role, COALESCE(CONCAT(m.first_name, ' ', m.last_name), 'None') AS manager
                FROM employee e
                JOIN role ON role.id = e.role_id
                LEFT JOIN employee m ON e.manager_id = m.id`
            );
            console.log();
            console.table(formatTable(employees.rows));
            console.log();
            break;
        //runs addDept() when 'add a department' is chosen
        case 'Add A Department':
            console.log();
            await addDept();
            console.log();
            break;
        //runs addRole() when 'add a role' is chosen
        case 'Add A Role':
            console.log();
            await addRole();
            console.log();
            break;
        //runs addEmp() when 'add an employee' is chosen
        case 'Add An Employee':
            console.log();
            await addEmp();
            console.log();
            break;
        //runs updateEmpRole() when 'update an employee role' is chosen
        case 'Update An Employee Role':
            console.log();
            await updateEmpRole();
            console.log();
            break;
        //exits the program
        case 'Exit':
            console.log();
            process.exit(0);
    }

    //runs mainMenu() again after response from whatever choice you make
    await mainMenu();
}

//function that adds a department to the department table, asks you a question and then puts your answer into the table
async function addDept() {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'newDeptName',
            message: 'Enter name of new department:'
        }
    ]);

    await query('INSERT INTO department (name) VALUES ($1)', [answer.newDeptName]);
    console.log('Department Added');
}

//function that adds a role to the role table, asks you a few questions and then puts your answers into the table
async function addRole() {

    const existingDept = await query('SELECT * FROM department');
    const deptChoice = existingDept.rows.map(dept => ({
        name: dept.name,
        value: dept.id
    }));

    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'newTitle',
            message: 'Enter new role title:'
        },
        {
            type: 'input',
            name: 'newSalary',
            message: 'Enter salary of new role:'
        },
        {
            type: 'list',
            name: 'whatDept',
            message: 'Department of new role:',
            choices: deptChoice
        }
    ]);

    await query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answer.newTitle, answer.newSalary, answer.whatDept]);
    console.log('Role Added');
}

//function that adds an employee to the employee table, asks you a few questions and then puts your answers into the table
async function addEmp() {
    const existingRole = await query('SELECT * FROM role');
    const roleChoice = existingRole.rows.map(role => ({
        name: role.title,
        value: role.id
    }));
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'empFirstName',
            message: 'Enter first name:'
        },
        {
            type: 'input',
            name: 'empLastName',
            message: 'Enter last name:'
        },
        {
            type: 'list',
            name: 'whatRole',
            message: 'Employee role:',
            choices: roleChoice
        }
    ]);

    await query('INSERT INTO employee (first_name, last_name, role_id) VALUES ($1, $2, $3)', [answer.empFirstName, answer.empLastName, answer.whatRole]);
    console.log('Employee Added');
}

//function to update an employee's role, let's you select an employee, then select a role for them, then updates table
async function updateEmpRole() {
    const existingEmp = await query('SELECT * FROM employee');
    const empChoice = existingEmp.rows.map(emp => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id
    }));
    const existingRoles = await query('SELECT * FROM role');
    const empRoleChoice = existingRoles.rows.map(role => ({
        name: role.title,
        value: role.id
    }));

    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'empName',
            message: 'Choose employee:',
            choices: empChoice
        },
        {
            type: 'list',
            name: 'empRole',
            message: 'Choose new role:',
            choices: empRoleChoice
        }
    ]);

    await query('UPDATE employee SET role_id = $2 WHERE id = $1', [answer.empName, answer.empRole]);
    console.log('Employee Role Updated');
}

//this was the hardest part of the assignment for me
//function to format tables to show up in terminal like they do in postgres
const formatTable = (data) => {
    //extracts keys from first object in 'data' array
    const columns = Object.keys(data[0]);
    //makes the table header, for each column name, it pads the name to a length of 20 characters with padEnd so that each column had the same width, then joins them with | to separate them visually
    const header = columns.map(col => col.padEnd(20)).join(' | ');
    //makes a separator string for the table, for each column, it makes a string of 20 dashes to visually separate each column, then it joins them with -|-
    const separator = columns.map(() => '-'.repeat(20)).join('-|-');
    //makes table rows, for each row in 'data', it maps over the columns to format each cell.
    //String(row etc..) converts the value in the cell to a string and pads it to 20 characters for alignment, then joins them with |
    //Then the final .join joins the formatted rows with new lines to make the final string representation of the table rows
    const rows = data.map(row => columns.map(col => String(row[col]).padEnd(20)).join(' | ')).join('\n');
    //combines the header, separator and rows into a single string
    return [header, separator, rows].join('\n');
}

//runs the initial main menu
mainMenu();