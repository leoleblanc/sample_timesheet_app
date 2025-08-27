require('dotenv').config();

const databaseName = process.env.DB_NAME;
const databasePassword = process.env.DB_PASSWORD;
const databaseHost = process.env.DB_HOST;
const databaseUser = process.env.DB_USER;

module.exports = { databaseName, databasePassword, databaseHost, databaseUser };