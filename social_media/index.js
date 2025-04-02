import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 9876;
app.use(bodyParser.json());

const API_BASE_URL = "http://20.244.56.144/evaluation-service";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAxNTA4LCJpYXQiOjE3NDM2MDEyMDgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjgwODgxZWM3LTc3ZmMtNDM5Ny05OWVkLTZhOGJjMTkyZTQyNyIsInN1YiI6IjIyMDUzNTE1QGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1MzUxNUBraWl0LmFjLmluIiwibmFtZSI6ImlzaGl0YSBwcmFkaGFuIiwicm9sbE5vIjoiMjIwNTM1MTUiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiI4MDg4MWVjNy03N2ZjLTQzOTctOTllZC02YThiYzE5MmU0MjciLCJjbGllbnRTZWNyZXQiOiJydkp5SEVzeHR5WEVYTWN6In0.KopnlTFZluiewkl4JhCipm9Q0VYiCZcRsd8Oys01RY0"; // Replace with your actual token

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {Authorization:`Bearer ${AUTH_TOKEN}`},
});

app.get("/users", async (req, res) => {
  try {
    const response = await apiClient.get("/users");
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/users/:userId/posts", async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await apiClient.get(`/users/${userId}/posts`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error.message);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  try {
    const response = await apiClient.get(`/posts/${postId}/comments`);
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error.message);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
