import React, { useState, useEffect } from "react";
import NewLineItem from './Components/NewLineItem';

function App() {
  const [key, setKey] = useState(0);
  const [timesheets, setTimesheets] = useState([]);
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/timesheets")
      .then((response) => {
        return response.json()
      })
      .then((timesheets) => {
        const fetchAllLineItems = timesheets.map((timesheet) => {
          return fetch(`http://localhost:4000/timesheets/${timesheet.id}/line-items`)
            .then((response) => {
              return response.json()
            })
            .then((timesheetLineItems) => {
              timesheet.lineItems = timesheetLineItems;
              return { ...timesheet, timesheetLineItems }
            })
            .catch((error) => {
              console.log(`Error fetching line items for timesheet with id ${timesheet.id} with error: `, error)
              return timesheet;
            })
        })

        Promise.all(fetchAllLineItems).then((updatedTimesheets) => {
          setTimesheets(updatedTimesheets)
        })
      })
      .catch((error) => console.error("Error fetching timesheets:", error))
  }, [key]);

  const reloadComponent = () => {
    setKey(key + 1)
  }


  const createTimesheet = (event) => {
    event.preventDefault();
    fetch("http://localhost:4000/timesheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, rate }),
    })
      .then((response) => response.json())
      .then((newTimesheet) => setTimesheets([...timesheets, newTimesheet]))
      .catch((error) => console.error("Error creating timesheet:", error));
  };

  const getTotalTimeForTimesheet = (timesheet) => {
    const { lineItems } = timesheet;

    if (!lineItems || lineItems.length === 0) {
      return 0
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

  return (
    <div key={key}>
      <h1>Timesheets</h1>
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
      <ul>
        {timesheets.map((timesheet) => (
          <li key={timesheet.id}>
            Description: <strong>{timesheet.description}</strong> | Rate: ${timesheet.rate} | {`Total Time: ${getTotalTimeForTimesheet(timesheet)} | Total Cost: $${getTotalCostForTimesheet(timesheet)}`}

            {timesheet.lineItems?.map((lineItem) => {
              return (
                <ul key={lineItem.id}>
                  {lineItem.date} - Minutes: {lineItem.minutes}
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