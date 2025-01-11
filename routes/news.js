import express from "express";
import fetch from "node-fetch";

const newsRouter = express.Router();

newsRouter.get("/", async (req, res) => {
  const { category } = req.query;
  const apiKey = process.env.NEWS_API_KEY;

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${category || "general"}&apiKey=${apiKey}`
    );
    const news = await response.json();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news", error: error.message });
  }
});

export default newsRouter;
