const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const server = express();
server.use(cors());
server.use(express.json());
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
    initDBTables(db);
} catch (error) {
    throw error;
}

server.post("/timesheets", (request, response) => {
    const { description, rate, firstLineItem } = request.body;
    const { date, minutes } = firstLineItem;

    db.beginTransaction((transactionError) => {
        if (transactionError) {
            console.log('Error occurred during transaction');
            return response.status(500).json(transactionError);
        }

        db.query(
            "INSERT INTO timesheets (description, rate) VALUES (?, ?)",
            [description, rate],
            (timesheetInsertionError, timesheetInsertionResult) => {
                if (timesheetInsertionError) {
                    return db.rollback(() =>
                        response.status(500).json(timesheetInsertionError)
                    );
                }

                const timesheetId = timesheetInsertionResult.insertId;

                db.query(
                    "INSERT INTO line_items (timesheet_id, date, minutes) VALUES (?, ?, ?)",
                    [timesheetId, date, minutes],
                    (lineItemInsertionError, lineItemInsertionResult) => {
                        if (lineItemInsertionError) {
                            return db.rollback(() => response.status(500).json(lineItemInsertionError));
                        }

                        db.commit((commitError) => {
                            if (commitError) {
                                return db.rollback(() => response.status(500).json(commitError));
                            }

                            return response.json({
                                id: timesheetId,
                                description,
                                rate,
                                firstLineItem: {
                                    id: lineItemInsertionResult.insertId,
                                    date,
                                    minutes,
                                },
                            });
                        });
                    }
                );
            }
        )
    })
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

        return response.json(data);
    })
})

server.get("/timesheets/:timesheet_id/line-items", (request, response) => {
    const { timesheet_id } = request.params;

    db.query(
        "SELECT * FROM line_items WHERE timesheet_id = ?",
        [timesheet_id],
        (error, results) => {
            if (error) {
                return response.status(500).json(error);
            }

            return response.json(results);
        }
    );
});

server.listen(port, () => console.log(`Server running on port ${port}`));