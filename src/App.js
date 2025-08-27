import React, { useState, useEffect } from "react";
import NewLineItem from './Components/NewLineItem';

function App() {
  const [key, setKey] = useState(0);
  const [timesheets, setTimesheets] = useState([]);
  const [initialLineItemDate, setInitialLineItemDate] = useState("")
  const [initialLineItemMinutes, setInitialLineItemMinutes] = useState("")
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/timesheets")
      .then((response) => response.json())
      .then((timesheets) => {
        const fetchAllLineItems = timesheets.map((timesheet) => {
          return fetch(`http://localhost:4000/timesheets/${timesheet.id}/line-items`)
            .then((response) => response.json())
            .then((timesheetLineItems) => {
              timesheet.lineItems = timesheetLineItems;
              return { ...timesheet, timesheetLineItems }
            })
            .catch((error) => {
              console.log(`Error fetching line items for timesheet with id ${timesheet.id} with error: `, error)
              return timesheet;
            })
        })

        Promise.all(fetchAllLineItems).then((updatedTimesheets) => setTimesheets(updatedTimesheets))
      })
      .catch((error) => console.error("Error fetching timesheets:", error))
  }, [key]);

  const reloadComponent = () => setKey(key + 1);


  const createTimesheet = (event) => {
    event.preventDefault();

    const firstLineItem = {
      date: initialLineItemDate,
      minutes: initialLineItemMinutes
    };

    fetch("http://localhost:4000/timesheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, rate, firstLineItem }),
    })
      .then((response) => response.json())
      .then((newTimesheet) => {
        setTimesheets([...timesheets, newTimesheet]);
        setInitialLineItemDate("");
        setInitialLineItemMinutes("");
        setRate("");
        setDescription("");
        reloadComponent();
      })
      .catch((error) => console.error("Error creating timesheet:", error));
  };

  const getTotalTimeForTimesheet = (timesheet) => {
    const { lineItems } = timesheet;

    if (!lineItems || lineItems.length === 0) {
      return 0;
    }

    const summedTime = lineItems.reduce((totalTime, lineItem) => totalTime + lineItem.minutes, 0);

    // using below for efficiency; if time is calculated first, then cost calculation is much quicker for the function below
    timesheet.totalTime = summedTime;

    return summedTime;
  }

  const getTotalCostForTimesheet = (timesheet) => {
    const { totalTime, rate } = timesheet;

    if (totalTime) {
      return totalTime * rate;
    }

    return getTotalTimeForTimesheet * rate;
  }

  const formatLineItemDate = (lineItemDate) => {
    const date = new Date(lineItemDate);
    return date.toLocaleDateString("en-CA");
  }

  return (
    <div key={key} style={{
      paddingLeft: '1ch'
    }}>
      <h1>Simple Timesheet App</h1>
      <h3>Create a timesheet by populating the two lines of fields near the "Create Timesheet" button. Add additional line items under a timesheet with "Add Line Item" </h3>
      <form onSubmit={createTimesheet}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <input
          type="number"
          placeholder="Rate"
          value={rate}
          onChange={(event) => setRate(event.target.value)}
        />
        <button type="submit">Create Timesheet</button>
      </form>
      {`Initial Line Item: `}
      <input
        type="date"
        value={initialLineItemDate}
        onChange={(event) => setInitialLineItemDate(event.target.value)}
      />
      <input
        type="number"
        placeholder="Minutes"
        value={initialLineItemMinutes}
        onChange={(event) => setInitialLineItemMinutes(event.target.value)}
      />
      <ul>
        {timesheets.map((timesheet) => (
          <li key={timesheet.id} style={{
            paddingBottom: '1ch'
          }}>
            Description: <strong>{timesheet.description}</strong> | Rate: ${timesheet.rate} | {`Total Time: ${getTotalTimeForTimesheet(timesheet)} | Total Cost: $${getTotalCostForTimesheet(timesheet)}`}

            {timesheet.lineItems?.map((lineItem) => {
              return (
                <ul key={lineItem.id}>
                  {formatLineItemDate(lineItem.date)} - Minutes: {lineItem.minutes}
                </ul>
              )
            })
            }
            <NewLineItem timesheetID={timesheet.id} onUpdate={reloadComponent} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;