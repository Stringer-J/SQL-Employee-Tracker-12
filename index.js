const inquirer = require('inquirer');
const { query } = require('./db');

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

        //makes query when selecting view all departments
        if(data.intro === 'View All Departments') {
            //actual query
            const result = await query('SELECT * FROM department');
            console.table(result.rows);

            //creates a formatted version of result, we are trying to get rid of index
            const formatResult = result.rows.map(row => ({
                ...row,
            }));

            //gets keys from object and runs formatted info into a new array
            const headers = Object.keys(formatResult[0] || {});

            //adds field names and dotted line
            console.log(headers.join(' '));
            // console.log(headers.map(() => '--').join('   '));

            //iterates over each row in formatResult
            formatResult.forEach(row => {
                //puts array elements into same string with ' | ' separator and logs it to console
                console.log(headers.map(header => row[header]).join('  '));
            });

        // makes query when selecting view all roles
        } else if(data.intro === 'View All Roles') {
        
            const result = await query('SELECT * FROM role');
            console.table(result.rows);
            
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
        } else if(data.intro === 'Exit') {
            process.exit(0);
        }
        await mainMenu();
    }

mainMenu();