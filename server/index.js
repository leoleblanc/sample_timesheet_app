const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const server = express();
server.use(cors());
server.use(express.json())
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

server.post("/timesheets", (request, response) => {
    const { description, rate } = request.body;
    db.query(
        "INSERT INTO timesheets (description, rate) VALUES (?, ?)",
        [description, rate],
        (error, result) => {
            if (error) {
                return response.status(500).json(error);
            }

            return response.json({ id: result.insertId, description, rate });
        }
    )
})

server.post("/timesheets/:timesheet_id/line-items", (request, response) => {
    const { timesheet_id } = request.params;
    const { date, minutes } = request.body;
    db.query(
        "INSERT INTO line_items (timesheet_id, date, minutes) VALUES (?, ?, ?)",
        [timesheet_id, date, minutes],
        (error, result) => {
            if (error) {
                return response.status(500).json(error);
            }

            return response.json({ id: result.insertId, timesheet_id: timesheet_id, date, minutes });
        }
    );
});

server.get("/timesheets", (request, response) => {
    db.query("SELECT * FROM timesheets", (error, data) => {
        if (error) {
            return response.status(500).json(err);
        }

        return response.json(data)
    })
})

server.listen(port, () => console.log(`Server running on port ${port}`));