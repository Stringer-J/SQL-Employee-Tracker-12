const inquirer = require('inquirer');

inquirer
    .prompt([
        {
            type: 'input',
            name: 'intro',
            message: 'what is up'
        }
    ])