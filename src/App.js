import React, { useState, useEffect } from "react";

function App() {
  const [timesheets, setTimesheets] = useState([])
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/timesheets")
      .then((response) => response.json())
      .then((data) => setTimesheets(data))
      .catch((error) => console.error("Error fetching timesheets:", error));
  });

  const createTimesheet = (event) => {
    event.preventDefault();
    fetch("http://localhost:4000/timesheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, rate }),
    })
      .then((response) => {
        console.log(response)
        return response.json()
      }
      )
      .then((newTimesheet) => setTimesheets([...timesheets, newTimesheet]))
      .catch((error) => console.error("Error creating timesheet:", error));
  };

  return (
    <div>
      <h1>Timesheets</h1>
      <form onSubmit={createTimesheet}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        <button type="submit">Create Timesheet</button>
      </form>
      <ul>
        {timesheets.map((timesheet) => (
          <li key={timesheet.id}>
            <strong>{timesheet.description}</strong> - Rate: ${timesheet.rate}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
