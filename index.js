const inquirer = require('inquirer');
const { query } = require('./db');

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

console.log(asciiArt);

async function mainMenu() {

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

    switch(data.intro) {
        case 'View All Departments':
            const departments = await query('SELECT * FROM department');
            console.log();
            console.table(formatTable(departments.rows));
            console.log();
            break;
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
        case 'View All Employees':
            const employees = await query(`
                SELECT employee.id, employee.first_name, employee.last_name, role.title AS role
                FROM employee
                JOIN role ON role.id = employee.role_id`
            );
            console.log();
            console.table(formatTable(employees.rows));
            console.log();
            break;
        case 'Add A Department':
            console.log();
            await addDept();
            console.log();
            break;
        case 'Add A Role':
            console.log();
            await addRole();
            console.log();
            break;
        case 'Add An Employee':
            console.log();
            await addEmp();
            console.log();
            break;
        case 'Update An Employee Role':
            console.log();
            await updateEmpRole();
            console.log();
            break;
        case 'Exit':
            console.log();
            process.exit(0);
    }

    await mainMenu();
}

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

const formatTable = (data) => {
    const columns = Object.keys(data[0]);
    const header = columns.map(col => col.padEnd(20)).join(' | ');
    const separator = columns.map(() => '-'.repeat(20)).join('-|-');
    const rows = data.map(row => columns.map(col => String(row[col]).padEnd(20)).join(' | ')).join('\n');
    return [header, separator, rows].join('\n');
}

mainMenu();