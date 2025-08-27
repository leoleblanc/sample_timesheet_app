This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Most of the scaffolding was left untouched, with changes in the following locations:
 * package.json
 * all of /server
 * src/Components/NewLineItem.js
 * src/App.js
 * .gitignore (to prevent committing what should not be)

The test files included here are part of the create-react-app, I did not touch them.

## Setup instructions

1. Install NPM. I used version 10.9.2.
2. Install MySQL. I used version 8.0.30 for MacOS on x86_64

All instructions below assume operation from within the root directory, the same level as package.json.
3. Create a file named `.env` in the root directory. Here, add two variables: DB_NAME=<YOUR_DB_NAME> and DB_PASSWORD=<YOUR_DB_PASSWORD>. These will be used by the server to connect to your MySQL database.
4. run `npm install` to install all dependencies.
5. run `npm run server` to start the server. This will initialize the tables for the database.
6. run `npm run start`. This will start the frontend of the application, populating any timesheets that already exist.
