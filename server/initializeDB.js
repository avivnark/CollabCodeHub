const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('codeblocks.db');

const codeBlocks = [
  {
    id: 1,
    name: 'Variables and Data Types',
    description: 'Declare a variable to store your age and print it to the console.',
    code: '',
    solution: 'const age = 25; console.log(age);',
  },
  {
    id: 2,
    name: 'Conditional Statements',
    description: 'Write a program that checks if a given number is even or odd.',
    code: '',
    solution: 'const number = 10;if (number % 2 === 0) {  console.log("Even");} else {  console.log("Odd");}',
  },
  {
    id: 3,
    name: 'Functions',
    description: 'Create a function that adds two numbers and returns the result.',
    code: '',
    solution: 'function addNumbers(a, b) {  return a + b;}const result = addNumbers(3, 4);console.log(result);',
  },
  {
    id: 4,
    name: 'Loops',
    description: 'Use a loop to print the numbers from 1 to 5 to the console.',
    code: '',
    solution: '1',
  },
];


db.serialize(() => {
  // Drop the existing table if it exists
  db.run('DROP TABLE IF EXISTS codeblocks');
  db.run('CREATE TABLE IF NOT EXISTS codeblocks (id INTEGER PRIMARY KEY, name TEXT, description TEXT, code TEXT, solution TEXT)');

  const insertStmt = db.prepare('INSERT INTO codeblocks (id, name, description, code, solution) VALUES (?, ?, ?, ?, ?)');

  codeBlocks.forEach((block) => {
    insertStmt.run(block.id, block.name, block.description, block.code, block.solution);
  });

  insertStmt.finalize();
});

db.close();
