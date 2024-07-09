const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

let requestCount = 0; // Counter to keep track of the number of requests
const MAX_REQUESTS_PER_SECOND = 50; // Maximum allowed requests per second

app.use(express.json()); // Middleware to parse JSON bodies

app.post("/api", (req, res) => {
  requestCount++; // Increment the request count
  console.log("requestCount" + requestCount);

  // If request count exceeds the maximum allowed, send a 429 status code
  if (requestCount > MAX_REQUESTS_PER_SECOND) {
    return res.status(429).send("Too many requests");
  }

  const { index } = req.body; // Extract index from the request body

  // Simulate processing delay
  const delay = Math.floor(Math.random() * 1000) + 1;
  setTimeout(() => {
    res.send(index.toString()); // Send the index back as the response
  }, delay);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Reset the request count every second
  setInterval(() => {
    requestCount = 0;
  }, 1000);
});
