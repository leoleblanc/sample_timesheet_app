require('dotenv').config();

const databaseName = process.env.DB_NAME;
const databasePassword = process.env.DB_PASSWORD;

module.exports = { databaseName, databasePassword };