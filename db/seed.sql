INSERT INTO department (id, name) values
('1', 'Finance'),
('2', 'Marketing'),
('3', 'Facilities'),
('4', 'Development'),
('5', 'HR');

INSERT INTO role (id, title, salary, department_id) values
('1', 'Accountant', '50000', '1'),
('2', 'Marketing Coordinator', '70000', '2'),
('3', 'Maintenance', '40000', '3'),
('4', 'Cloud Engineer', '60000', '4'),
('5', 'Administrator', '80000', '5');


INSERT INTO employee (id, first_name, last_name, role_id, manager_id) values
('1', 'Bob', 'Ross', '1', '1'),
('2', 'Clair', 'Redfield', '2', '2'),
('3', 'Scott', 'Stapp', '3', '3'),
('4', 'Steve', 'Urkel', '4', '4'),
('5', 'Jill', 'Valentine', '5', '5');