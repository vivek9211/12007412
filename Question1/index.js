
const express = require("express");
const axios = require("axios");
const { log } = require("console");
const app = express();
const port = 3000;

app.get("/numbers", async (req, res) => {
  const urlString = req.query.url;

  // if url params not available
  if (!urlString) {
    res.send("Url Not Found");
  }

  // iterating through all urls
  try {
    const numberSets = urlString.map(async (url) => {
      try {
        // fetching the one by one url from urls using axios
        const response = await axios.get(url, {timeout: 500});
        return response.data.numbers;
      } catch (error) {
        if(error.code === 'ECONNABORTED') {
            console.error("This url taking more time: " + url);
        }
        console.log(error);
        return [];
      }
    });

    // taking unique number from numberSets and sorting
    const allNumbers = await Promise.all(numberSets);
    const mergedNumbers = allNumbers.flat();
    const sortedUniqueNumbers = Array.from(new Set(mergedNumbers)).sort(
      (a, b) => a - b
    );

    res.json({ numbers: sortedUniqueNumbers });
  } catch (error) {
    console.error("Error processing URLs:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

