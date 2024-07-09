import React, { useState } from "react";
import axios from "axios";

function App() {
  const [concurrency, setConcurrency] = useState(10); // State to manage concurrency
  const [isRunning, setIsRunning] = useState(false); // State to track if the requests are running
  const [results, setResults] = useState([]); // State to store the results

  const handleStart = async () => {
    setIsRunning(true); // Set isRunning to true
    setResults([]); // Clear previous results

    const maxRequests = 1000; // Total number of requests to be sent
    const requestsPerSecond = concurrency; // Number of requests per second
    const delay = 1000 / requestsPerSecond; // Delay between each batch of requests

    const sendRequest = async (index) => {
      try {
        // Send a POST request to the API
        const response = await axios.post("/api", {
          index,
          rateLimit: requestsPerSecond,
        });
        // Add the response data to the results
        setResults((prevResults) => [...prevResults, response.data]);
      } catch (error) {
        console.error("Error in request:", error);
      }
    };

    let activeRequests = 0; // Counter for active requests
    let i = 1; // Counter for the number of requests sent

    const interval = setInterval(async () => {
      // Send requests while activeRequests is less than concurrency and total requests are not exceeded
      while (activeRequests < concurrency && i <= maxRequests) {
        activeRequests++;
        sendRequest(i).finally(() => {
          activeRequests--;
        });
        i++;
      }
      // If all requests are sent, clear the interval and set isRunning to false
      if (i > maxRequests) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, delay);
  };

  const handleChange = (e) => {
    const value = Number(e.target.value);
    // Update concurrency if the value is within the specified range
    if (value >= 1 && value <= 100) {
      setConcurrency(value);
    }
  };

  return (
    <div>
      <input
        type="number"
        min="1"
        max="100"
        value={concurrency}
        onChange={handleChange}
        required
      />
      <button onClick={handleStart} disabled={isRunning}>
        {isRunning ? "Running..." : "Start"}
      </button>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
