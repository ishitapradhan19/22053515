import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 9876;
app.use(bodyParser.json());

const numberWindow = [];
const WINDOW_SIZE = 10;
let authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAxNTA4LCJpYXQiOjE3NDM2MDEyMDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjgwODgxZWM3LTc3ZmMtNDM5Ny05OWVkLTZhOGJjMTkyZTQyNyIsInN1YiI6IjIyMDUzNTE1QGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1MzUxNUBraWl0LmFjLmluIiwibmFtZSI6ImlzaGl0YSBwcmFkaGFuIiwicm9sbE5vIjoiMjIwNTM1MTUiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiI4MDg4MWVjNy03N2ZjLTQzOTctOTllZC02YThiYzE5MmU0MjciLCJjbGllbnRTZWNyZXQiOiJydkp5SEVzeHR5WEVYTWN6In0.KopnlTFZluiewkl4JhCipm9Q0VYiCZcRsd8Oys01RY0";

const API_URLS = {
  p: "http://20.244.56.144/evaluation-service/primes",
  f: "http://20.244.56.144/evaluation-service/fibo",
  e: "http://20.244.56.144/evaluation-service/even",
  r: "http://20.244.56.144/evaluation-service/rand",
};

const authenticate = async () => {
  try {
    const response = await axios.post("http://20.244.56.144/evaluation-service/auth", {
      email: "22053515@kiit.ac.in",
      name: "Ishita Pradhan",
      rollNo: "22053515",
      accessCode: "nwpwrZ",
      clientID: "80881ec7-77fc-4397-99ed-6a8bc192e427",
      clientSecret: "rvJyHEsxtyXEXMcz"
    });
    authToken = response.data.access_token;
  } catch (error) {
    console.error("Authentication failed:", error.message);
  }
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  return (numbers.reduce((sum, num) => sum + num, 0) / numbers.length).toFixed(2);
};

app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;
  
  if (!API_URLS[numberid]) {
    return res.status(400).json({ error: "Invalid number type. Use p, f, e, or r." });
  }

  try {
    const sourceApi = API_URLS[numberid];
    const response = await axios.get(sourceApi, {
      timeout: 500,
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const newNumbers = response.data.numbers || [];

    const windowPrevState = [...numberWindow];

    newNumbers.forEach((num) => {
      if (!numberWindow.includes(num)) {
        if (numberWindow.length >= WINDOW_SIZE) {
          numberWindow.shift(); 
        }
        numberWindow.push(num);
      }
    });

    const avg = calculateAverage(numberWindow);

    res.json({
      windowPrevState,
      windowCurrState: numberWindow,
      numbers: newNumbers,
      avg,
    });
  } catch (error) {
    console.error("Error fetching numbers:", error.message);
    res.status(500).json({ error: "Failed to fetch numbers within 500ms" });
  }
});

app.listen(port, async () => {
  await authenticate();
  console.log(`Server running on port ${port}`);
});
