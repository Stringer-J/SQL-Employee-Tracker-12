const inquirer = require('inquirer');

inquirer
    .prompt([
        {
            type: 'list',
            name: 'intro',
            message: '\n\n=== Employee Tracker ===\nWhat would you like to do?',
            choices: ['View All Departments',
                      'View All Roles',
                      'View All Employees',
                      'Add A Department',
                      'Add A Role',
                      'Add An Employee',
                      'Update An Employee Role'
                     ]
        }
    ]).then((data) => {
        if(data.intro === 'View All Departments') {
            console.log('1');
        } else if(data.intro === 'View All Roles') {
            console.log('1');
        } else if(data.intro === 'View All Employees') {
            console.log('1');
        } else if(data.intro === 'Add A Department') {
            console.log('1');
        } else if(data.intro === 'Add A Role') {
            console.log('1');
        } else if(data.intro === 'Add An Employee') {
            console.log('1');
        } else if(data.intro === 'Update An Employee Role') {
            console.log('1');
        } 
    })