import React, { useState } from "react";

const NewLineItem = (props) => {
    const [lineItemDate, setLineItemDate] = useState("");
    const [lineItemMinutes, setLineItemMinutes] = useState("");

    const { timesheetID, onUpdate } = props;
    return (
        <form
            style={{
                textIndent: '4ch'
            }}
            onSubmit={(event) => {
                event.preventDefault();
                fetch(`http://localhost:4000/timesheets/${timesheetID}/line-items`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ timesheet_id: timesheetID, date: lineItemDate, minutes: lineItemMinutes }),
                })
                    .then((response) => response.json())
                    .then((newLineItem) => {
                        console.log('successfully added line item')
                        onUpdate()
                    })
                    .catch((error) => console.error("Error adding line item:", error));
            }}
        >
            <input
                type="date"
                value={lineItemDate}
                onChange={(event) => setLineItemDate(event.target.value)}
            />
            <input
                type="number"
                placeholder="Minutes"
                value={lineItemMinutes}
                onChange={(event) => setLineItemMinutes(event.target.value)}
            />
            <button type="submit">Add Line Item</button>
        </form>
    )
}

export default NewLineItem;