This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Most of the scaffolding was left untouched, with changes in the following locations:
 * package.json
 * all of /server
 * src/Components/NewLineItem.js
 * src/App.js
 * .gitignore

The test files included here are part of the create-react-app, I did not touch them.

## Setup instructions

1. Install NPM. I used version 10.9.2.
2. Install MySQL. I used version 8.0.30 for MacOS on x86_64. Ensure the MySQL server is running.
3. Clone this repository.

All instructions below assume operation from within the root of this directory.
1. Create a file named `.env`. Here, add four variables: DB_NAME=<YOUR_DB_NAME>, DB_PASSWORD=<YOUR_DB_PASSWORD>, DB_HOST=<YOUR_DB_HOST>, and DB_USER=<YOUR_DB_USER>. These will be used by the server to connect to your MySQL database. For me, DB_HOST and DB_USER are "localhost" and "root", respectively (without quotations).
2. run `npm install` to install all dependencies.
3. run `npm run server` to start the server. This will initialize the tables for the database defined in `.env` the first time the server boots up.
4. run `npm run start`. This will start the frontend of the application, populating any timesheets that already exist.

As updates are made to the timesheets, they are saved to the database, and users can come back later.
