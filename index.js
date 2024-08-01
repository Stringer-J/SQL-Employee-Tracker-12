const inquirer = require('inquirer');

inquirer
    .prompt([
        {
            type: 'list',
            name: 'intro',
            message: '=== Employee Tracker ===\n',
            choices: ['view all departments',
                      'view all roles',
                      'view all employees',
                      'add a department',
                      'add a role',
                      'add an employee',
                      'update an employee role'
                     ]
        }
    ]).then((data) => {
        if(data.intro === 'view all departments') {
            console.log('1');
        } else if(data.intro === 'view all roles') {
            console.log('1');
        } else if(data.intro === 'view all employees') {
            console.log('1');
        } else if(data.intro === 'add a department') {
            console.log('1');
        } else if(data.intro === 'add a role') {
            console.log('1');
        } else if(data.intro === 'add an employee') {
            console.log('1');
        } else if(data.intro === 'update an employee role') {
            console.log('1');
        } 
    })