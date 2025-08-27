const { databaseName } = require('./environmentVariables')

const initDBTables = (db) => {
    db.query(
        `CREATE DATABASE IF NOT EXISTS ${databaseName};`
    )

    db.query(
        `CREATE TABLE IF NOT EXISTS timesheets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            description TEXT,
            rate DECIMAL(10,2) NOT NULL DEFAULT 1.00,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);`
    );

    db.query(
        `CREATE TABLE IF NOT EXISTS line_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            timesheet_id INT NOT NULL,
            date DATE NOT NULL,
            minutes INT NOT NULL CHECK (minutes > 0),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (timesheet_id) REFERENCES timesheets(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        );`
    )
}

module.exports = initDBTables;