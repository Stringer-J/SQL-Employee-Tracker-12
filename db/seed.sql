INSERT INTO department (name) values
('Finance'),
('Marketing'),
('Facilities'),
('Development'),
('HR');

INSERT INTO role (title, salary, department_id) values
('Accountant', '50000', '1'),
('Marketing Coordinator', '70000', '2'),
('Maintenance', '40000', '3'),
('Cloud Engineer', '60000', '4'),
('Administrator', '80000', '5');


INSERT INTO employee (first_name, last_name, role_id, manager_id) values
('Bob', 'Ross', '1', '1'),
('Clair', 'Redfield', '2', '2'),
('Scott', 'Stapp', '3', '3'),
('Steve', 'Urkel', '4', '4'),
('Jill', 'Valentine', '5', '5');