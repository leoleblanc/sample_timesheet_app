const express = require("express");
const mysql = require("mysql2");

const server = express();
const port = 4000;

const initDBTables = require('./initDBTables');
const { databaseName, databasePassword } = require('./environmentVariables');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: databaseName,
    password: databasePassword
});

try {
    initDBTables(db)
} catch (error) {
    throw error;
}

server.listen(port, () => console.log(`Server running on port ${port}`));